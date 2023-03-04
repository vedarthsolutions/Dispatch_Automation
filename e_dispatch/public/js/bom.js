
function nextTick(fn, context = null) {
    return (...args) => {
        return new Promise(resolve => {
            const execute = () => {
                const out = fn.apply(context, args);
                resolve(out);
            };
            setTimeout(execute);
        });
    };
}

function camelCaseToDash(str) {
    return str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}

function isSet(val) {
    return val !== undefined || val !== null;
}

function notSet(val) {
    return !isSet(val);
}

function isNumber(val) {
    return !isNaN(val);
}

function ensureArray(val) {
    if (!Array.isArray(val)) {
        return [val];
    }
    return val;
}

function uniq$1(arr) {
    return uniq_1(arr);
}

function numberSortAsc(a, b) {
    return a - b;
}
function stripHTML(html) {
    return html.replace(/<[^>]*>/g, '');
}
function format(str, args) {
    if (!str) return str;

    Object.keys(args).forEach(arg => {
        let regex = new RegExp(`{(${arg})}`, 'g');
        str = str.replace(regex, args[arg]);
    });

    return str;
}

function makeDataAttributeString(props) {
    const keys = Object.keys(props);

    return keys
        .map((key) => {
            const _key = camelCaseToDash(key);
            const val = props[key];

            if (val === undefined) return '';
            return `data-${_key}="${val}" `;
        })
        .join('')
        .trim();
}

function linkProperties(target, source, properties) {
    const props = properties.reduce((acc, prop) => {
        acc[prop] = {
            get() {
                return source[prop];
            }
        };
        return acc;
    }, {});
    Object.defineProperties(target, props);
}

class RowManager {
    constructor(instance) {
        this.instance = instance;
        linkProperties(this, this.instance, [
            'options',
            'fireEvent',
            'wrapper',
            'bodyScrollable',
            'bodyRenderer',
            'style'
        ]);

        this.bindEvents();
        this.refreshRows = nextTick(this.refreshRows, this);
    }

    get datamanager() {
        return this.instance.datamanager;
    }

    get cellmanager() {
        return this.instance.cellmanager;
    }

    bindEvents() {
        this.bindCheckbox();
    }

    bindCheckbox() {
        if (!this.options.checkboxColumn) return;

        // map of checked rows
        this.checkMap = [];

        $.on(this.wrapper, 'click', '.dt-cell--col-0 [type="checkbox"]', (e, $checkbox) => {
            const $cell = $checkbox.closest('.dt-cell');
            const {
                rowIndex,
                isHeader
            } = $.data($cell);
            const checked = $checkbox.checked;

            if (isHeader) {
                this.checkAll(checked);
            } else {
                this.checkRow(rowIndex, checked);
            }
        });

		$.on(this.wrapper, 'change', '.production_state', (e) => {
			const $cell = e.target.closest('.dt-cell');
			console.log($cell);
        });
    }

    refreshRows() {
        this.instance.renderBody();
        this.instance.setDimensions();
    }

    refreshRow(row, rowIndex) {
        const _row = this.datamanager.updateRow(row, rowIndex);

        _row.forEach(cell => {
            this.cellmanager.refreshCell(cell);
        });
    }

    getCheckedRows() {
        if (!this.checkMap) {
            return [];
        }

        let out = [];
        for (let rowIndex in this.checkMap) {
            const checked = this.checkMap[rowIndex];
            if (checked === 1) {
                out.push(rowIndex);
            }
        }

        return out;
    }

    highlightCheckedRows() {
        this.getCheckedRows()
            .map(rowIndex => this.checkRow(rowIndex, true));
    }

    checkRow(rowIndex, toggle) {
        const value = toggle ? 1 : 0;
        const selector = rowIndex => `.dt-cell--0-${rowIndex} [type="checkbox"]`;
        // update internal map
        this.checkMap[rowIndex] = value;
        // set checkbox value explicitly
        $.each(selector(rowIndex), this.bodyScrollable)
            .map(input => {
                input.checked = toggle;
            });
        // highlight row
        this.highlightRow(rowIndex, toggle);
        this.showCheckStatus();
        this.fireEvent('onCheckRow', this.datamanager.getRow(rowIndex));
    }

    checkAll(toggle) {
        const value = toggle ? 1 : 0;

        // update internal map
        if (toggle) {
            this.checkMap = Array.from(Array(this.getTotalRows())).map(c => value);
        } else {
            this.checkMap = [];
        }
        // set checkbox value
        $.each('.dt-cell--col-0 [type="checkbox"]', this.bodyScrollable)
            .map(input => {
                input.checked = toggle;
            });
        // highlight all
        this.highlightAll(toggle);
        this.showCheckStatus();
        this.fireEvent('onCheckRow');
    }

    showCheckStatus() {
        if (!this.options.checkedRowStatus) return;
        const checkedRows = this.getCheckedRows();
        const count = checkedRows.length;
        if (count > 0) {
            let message = this.instance.translate('{count} rows selected', {
                count: count
            });
            this.bodyRenderer.showToastMessage(message);
        } else {
            this.bodyRenderer.clearToastMessage();
        }
    }

    highlightRow(rowIndex, toggle = true) {
        const $row = this.getRow$(rowIndex);
        if (!$row) return;

        if (!toggle && this.bodyScrollable.classList.contains('dt-scrollable--highlight-all')) {
            $row.classList.add('dt-row--unhighlight');
            return;
        }

        if (toggle && $row.classList.contains('dt-row--unhighlight')) {
            $row.classList.remove('dt-row--unhighlight');
        }

        this._highlightedRows = this._highlightedRows || {};

        if (toggle) {
            $row.classList.add('dt-row--highlight');
            this._highlightedRows[rowIndex] = $row;
        } else {
            $row.classList.remove('dt-row--highlight');
            delete this._highlightedRows[rowIndex];
        }
    }

    highlightAll(toggle = true) {
        if (toggle) {
            this.bodyScrollable.classList.add('dt-scrollable--highlight-all');
        } else {
            this.bodyScrollable.classList.remove('dt-scrollable--highlight-all');
            for (const rowIndex in this._highlightedRows) {
                const $row = this._highlightedRows[rowIndex];
                $row.classList.remove('dt-row--highlight');
            }
            this._highlightedRows = {};
        }
    }

    showRows(rowIndices) {
        rowIndices = ensureArray(rowIndices);
        const rows = rowIndices.map(rowIndex => this.datamanager.getRow(rowIndex));
        this.bodyRenderer.renderRows(rows);
    }

    showAllRows() {
        const rowIndices = this.datamanager.getAllRowIndices();
        this.showRows(rowIndices);
    }

    getChildrenToShowForNode(rowIndex) {
        const row = this.datamanager.getRow(rowIndex);
        row.meta.isTreeNodeClose = false;

        return this.datamanager.getImmediateChildren(rowIndex);
    }

    openSingleNode(rowIndex) {
        const childrenToShow = this.getChildrenToShowForNode(rowIndex);
        const visibleRowIndices = this.bodyRenderer.visibleRowIndices;
        const rowsToShow = uniq$1([...childrenToShow, ...visibleRowIndices]).sort(numberSortAsc);

        this.showRows(rowsToShow);
    }

    getChildrenToHideForNode(rowIndex) {
        const row = this.datamanager.getRow(rowIndex);
        row.meta.isTreeNodeClose = true;

        const rowsToHide = this.datamanager.getChildren(rowIndex);
        rowsToHide.forEach(rowIndex => {
            const row = this.datamanager.getRow(rowIndex);
            if (!row.meta.isLeaf) {
                row.meta.isTreeNodeClose = true;
            }
        });

        return rowsToHide;
    }

    closeSingleNode(rowIndex) {
        const rowsToHide = this.getChildrenToHideForNode(rowIndex);
        const visibleRows = this.bodyRenderer.visibleRowIndices;
        const rowsToShow = visibleRows
            .filter(rowIndex => !rowsToHide.includes(rowIndex))
            .sort(numberSortAsc);

        this.showRows(rowsToShow);
    }

    expandAllNodes() {
        let rows = this.datamanager.getRows();
        let rootNodes = rows.filter(row => !row.meta.isLeaf);

        const childrenToShow = rootNodes.map(row => this.getChildrenToShowForNode(row.meta.rowIndex)).flat();
        const visibleRowIndices = this.bodyRenderer.visibleRowIndices;
        const rowsToShow = uniq$1([...childrenToShow, ...visibleRowIndices]).sort(numberSortAsc);

        this.showRows(rowsToShow);
    }

    collapseAllNodes() {
        let rows = this.datamanager.getRows();
        let rootNodes = rows.filter(row => row.meta.indent === 0);

        const rowsToHide = rootNodes.map(row => this.getChildrenToHideForNode(row.meta.rowIndex)).flat();
        const visibleRows = this.bodyRenderer.visibleRowIndices;
        const rowsToShow = visibleRows
            .filter(rowIndex => !rowsToHide.includes(rowIndex))
            .sort(numberSortAsc);

        this.showRows(rowsToShow);
    }

    setTreeDepth(depth) {
        let rows = this.datamanager.getRows();

        const rowsToOpen = rows.filter(row => row.meta.indent < depth);
        const rowsToClose = rows.filter(row => row.meta.indent >= depth);
        const rowsToHide = rowsToClose.filter(row => row.meta.indent > depth);

        rowsToClose.forEach(row => {
            if (!row.meta.isLeaf) {
                row.meta.isTreeNodeClose = true;
            }
        });
        rowsToOpen.forEach(row => {
            if (!row.meta.isLeaf) {
                row.meta.isTreeNodeClose = false;
            }
        });

        const rowsToShow = rows
            .filter(row => !rowsToHide.includes(row))
            .map(row => row.meta.rowIndex)
            .sort(numberSortAsc);
        this.showRows(rowsToShow);
    }

    getRow$(rowIndex) {
        return $(this.selector(rowIndex), this.bodyScrollable);
    }

    getTotalRows() {
        return this.datamanager.getRowCount();
    }

    getFirstRowIndex() {
        return 0;
    }

    getLastRowIndex() {
        return this.datamanager.getRowCount() - 1;
    }

    scrollToRow(rowIndex) {
        rowIndex = +rowIndex;
        this._lastScrollTo = this._lastScrollTo || 0;
        const $row = this.getRow$(rowIndex);
        if ($.inViewport($row, this.bodyScrollable)) return;

        const {
            height
        } = $row.getBoundingClientRect();
        const {
            top,
            bottom
        } = this.bodyScrollable.getBoundingClientRect();
        const rowsInView = Math.floor((bottom - top) / height);

        let offset = 0;
        if (rowIndex > this._lastScrollTo) {
            offset = height * ((rowIndex + 1) - rowsInView);
        } else {
            offset = height * ((rowIndex + 1) - 1);
        }

        this._lastScrollTo = rowIndex;
        $.scrollTop(this.bodyScrollable, offset);
    }

    getRowHTML(row, props) {
        const dataAttr = makeDataAttributeString(props);
        let rowIdentifier = props.rowIndex;

        if (props.isFilter) {
            row = row.map(cell => (Object.assign({}, cell, {
                content: this.getFilterInput({
                    colIndex: cell.colIndex
                }),
                isFilter: 1,
                isHeader: undefined,
                editable: false
            })));

            rowIdentifier = 'filter';
        }

        if (props.isHeader) {
            rowIdentifier = 'header';
        }

        return `
            <div class="dt-row dt-row-${rowIdentifier}" ${dataAttr}>
                ${row.map(cell => this.cellmanager.getCellHTML(cell)).join('')}
            </div>
        `;
    }

    getFilterInput(props) {
        const dataAttr = makeDataAttributeString(props);
        return `<input class="dt-filter dt-input" type="text" ${dataAttr} tabindex="1" />`;
    }

    selector(rowIndex) {
        return `.dt-row-${rowIndex}`;
    }
}



frappe.ui.form.on("BOM", {
	refresh(frm) {
		frm.fields_dict.bom_browse_html.$wrapper.html('');
		if (!frm.is_new()) {
			frm.trigger("prepare_bom_browser");
		}

		if (frm.doc.docstatus === 1) {
			frm.toggle_display("prepare_bom_tree", false);
		}
	},

	prepare_bom_browser(frm) {
		let div = `<div id="bom-browser">BOM</div>`;
		frm.fields_dict.bom_browse_html.$wrapper.html(div);
		frm.fields_dict.bom_browse_html.$wrapper.find('#bom-browser').empty();
		frm.trigger("render_bom_browser");
	},

	prepare_bom_tree(frm) {
		frappe.call({
			method: 'e_dispatch.custom_folder.custom_bom.update_bom_custom_items',
			freeze: true,
			args: {
				bom_no: frm.doc.name,
			},
			callback(r) {
				frm.trigger("render_bom_browser");
				frm.reload_doc();
			}
		})
	},

	render_bom_browser(frm) {
		frappe.call({
			method: 'e_dispatch.custom_folder.custom_bom.get_custom_bom_items',
			freeze: true,
			args: {
				bom_no: frm.doc.name,
			},
			callback(r) {
				if(r.message.length) {
					let bom_data = r.message.map(d => {
						return {
							"item_code": d.item_code,
							"qty": d.qty,
							"bom": d.bom,
							"production_state": d.production_state || "Ignore",
							"indent": d.indent,
							"bom_no": d.bom_no,
							"name": d.name,
							"customers": d.customers,
							"default_customer": d.default_customer,
							frm: frm
						}
					});

					let selector = frm.fields_dict.bom_browse_html.$wrapper.find('#bom-browser');
					frm.datatable = new frappe.DataTable(selector[0], {
						columns: [{
							id: "item_code",
							name: "Item Code",
							editable: false,
							width: 200
						}, {
							id: "indent",
							name: "BOM Level",
							editable: false,
							width: 100
						}, {
							id: "qty",
							name: "QTY",
							editable: false,
							width: 100
						}, {
							id: "bom",
							name: "BOM",
							editable: false,
							width: 200
						}, {
							id: "production_state",
							name: "State",
							editable: false,
							width: 200,
							format: (value, row, column, data) => {
								value = value;

								if (data.frm && data.frm.datatable) {
									frm.events.bind_events(data.frm);
								}

								if (data.bom_no) {
									return `<select id="${data.name}" class="input-with-feedback form-control production_state" style="height:30px">
										<option value="Ignore" ${value == "Ignore" ? "selected" : ""}>Ignore</option>
										<option value="In House" ${value == "In House" ? "selected" : ""}>In House</option>
										<option value="Subcontract" ${value == "Subcontract" ? "selected" : ""}>Subcontract</option>
										<option value="Purchase" ${value == "Purchase" ? "selected" : ""}>Purchase</option>
                                        <option value="In House and Resale" ${value == "In House and Resale" ? "selected" : ""}>In House and Resale</option>
                                        <option value="Subcontract and Resale" ${value == "Subcontract and Resale" ? "selected" : ""}>Subcontract and Resale</option>
										<option value="Purchase and Resale" ${value == "Purchase and Resale" ? "selected" : ""}>Purchase and Resale</option>
									</select>`;
								} else {
									return `<select id="${data.name}" class="input-with-feedback form-control production_state" style="height:30px">
										<option value="Ignore" ${value == "Ignore" ? "selected" : ""}>Ignore</option>
										<option value="Purchase" ${value == "Purchase" ? "selected" : ""}>Purchase</option>
										<option value="Purchase and Resale" ${value == "Purchase and Resale" ? "selected" : ""}>Purchase and Resale</option>
									</select>`;
								}
							}
						}, {
							id: "default_customer",
							name: "Default Customer",
							editable: false,
							width: 200,
							format: (value, row, column, data) => {
								value = value;
								if (data.frm && data.frm.datatable) {
									frm.events.bind_events(data.frm);
								}

								value = add_select(value, data);
								return value;
							}
						}],
						data: bom_data,
						name_field: "item_code",
						treeView: true,
						overrideComponents: {
							RowManager,
						}
					});

					frm.datatable.rowmanager.setTreeDepth(10);
					if (frm.doc.docstatus != 0) {
						$(frm.datatable.wrapper).find(".production_state").attr("disabled", true);
					}

					frm.events.bind_events(frm);
				}
			}
		})
	},

	bind_events(frm) {
		frm.events.update_production_state(frm);
		frm.events.update_default_customer(frm);
	},

	update_production_state(frm) {
		$(frm.datatable.rowmanager.wrapper).find(".production_state")
			.change((e) => {
				let name = $(e.target).attr('id');
				let value = $(e.target).val();

				if (name && value) {
					frappe.call({
						method: "e_dispatch.custom_folder.custom_bom.update_production_state",
						freeze: true,
						args: {
							name: name,
							value: value
						},
						callback: (r) => {
							frm.reload_doc();
						}
					})
				}
			});
	},

	update_default_customer(frm) {
		$(frm.datatable.rowmanager.wrapper).find(".default_customer")
			.change((e) => {
				let name = $(e.target).attr('id');
				let value = $(e.target).val();

				if (name && value) {
					frappe.call({
						method: "e_dispatch.custom_folder.custom_bom.update_default_customer",
						freeze: true,
						args: {
							name: name,
							value: value
						},
						callback: (r) => {
							frm.reload_doc();
						}
					})
				}
			});
	}
});

// columns: [{
//     label: 'Item Code',
//     fieldname: 'item_code',
//     fieldtype: 'Link',
//     options: 'Item',
//     width: 200
// }, {
//     label: 'Quantity',
//     fieldname: 'qty',
//     fieldtype: 'Float',
//     width: 100
// }, {
//     label: 'Indent',
//     fieldname: 'indent',
//     fieldtype: 'Int',
// }]

function add_select(value, data) {
	let options = '<option value=""></option>';
	if (data.customers && data.customers.length > 0) {
		data.customers.forEach((customer) => {
			options += `<option value="${customer}" ${value == customer ? "selected" : ""}>${customer}</option>`;
		});
	}

	return `<select id="${data.name}" class="input-with-feedback form-control default_customer" style="height:30px">
		${options}
	</select>`;
}