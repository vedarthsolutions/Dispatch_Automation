from . import __version__ as app_version

app_name = "e_dispatch"
app_title = "E Dispatch"
app_publisher = "Vedarth"
app_description = "E-Dispatch"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "test@example.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/e_dispatch/css/e_dispatch.css"
# app_include_js = "/assets/e_dispatch/js/e_dispatch.js"

# include js, css files in header of web template
# web_include_css = "/assets/e_dispatch/css/e_dispatch.css"
# web_include_js = "/assets/e_dispatch/js/e_dispatch.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "e_dispatch/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "e_dispatch.utils.jinja_methods",
# 	"filters": "e_dispatch.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "e_dispatch.install.before_install"
# after_install = "e_dispatch.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "e_dispatch.uninstall.before_uninstall"
# after_uninstall = "e_dispatch.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "e_dispatch.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"e_dispatch.tasks.all"
# 	],
# 	"daily": [
# 		"e_dispatch.tasks.daily"
# 	],
# 	"hourly": [
# 		"e_dispatch.tasks.hourly"
# 	],
# 	"weekly": [
# 		"e_dispatch.tasks.weekly"
# 	],
# 	"monthly": [
# 		"e_dispatch.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "e_dispatch.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "e_dispatch.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "e_dispatch.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]


# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"e_dispatch.auth.validate"
# ]

