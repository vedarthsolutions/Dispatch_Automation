# Copyright (c) 2024, Vedarth and contributors
# For license information, please see license.txt

# import frappe
import frappe
from frappe.model.document import Document


class EDispatchAutomationSettings(Document):
	pass



@frappe.whitelist()
def get_dynamsoft_license_key():
    # Fetch the first record in e_dispatch_automation_settings
    settings = frappe.get_single('E Dispatch Automation Settings')
    if settings:
        return settings.dynamsoft_key
    else:
        frappe.throw("Dynamsoft Key not found in settings.")
