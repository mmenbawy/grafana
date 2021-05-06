+++
title = "Provisioning roles and assignments"
description = "Understand how to provision roles and assignments"
keywords = ["grafana", "access-control", "roles", "provisioning", "assignments", "permissions", "enterprise"]
weight = 120
+++

# Provisioning roles and assignments

> Feature available in Grafana Enterprise 8.0+.

It is possible to manage your roles and even assign them to [built-in roles]({{< relref "./concepts/roles.md#built-in-role-assignments" >}}) or already created teams, by adding one or more YAML config files in the [`provisioning/access-control/`]({{< relref "../../administration/configuration/#provisioning" >}}) directory. Each config file can contain a list of `roles` that will be created or updated during start up. Upon version increment, Grafana updates the role to match the configuration file. The configuration file can also contain a list of roles that should be deleted. That list is called `deleteRoles`. Grafana will role deletion after role insertion/update.

> Managing your roles can also be done using the [`access-control HTTP API`]({{< relref "../../http_api/access_control/" >}})

## Example of a Role Configuration File

```yaml
# config file version
apiVersion: 1

# list of roles that should be deleted from the database
deleteRoles:
  # <string> name of the role you want to create. Required if no uid
  - name: ReportEditor
    # <string> uid of the role. Required if no name
    uid: reporteditor1
    # <int> org id. will default to Grafana's default if not specified
    orgId: 1
    # <bool> force deletion revoking all grants of the role
    force: true

# list of roles to insert/update depending on what is available in the database
roles:
  # <string, required> name of the role you want to create. Required
  - name: CustomEditor
    # <string> uid of the role. Has to be unique for all orgs.
    uid: customeditor1
    # <string> description of the role, informative purpose only.
    description: "Role for our custom user editors"
    # <int> version of the role, Grafana will update the role when increased
    version: 2
    # <int> org id. will default to Grafana's default if not specified
    orgId: 1
    # <list> list of the permissions granted by this role
    permissions:
      # <string> action allowed
      - action: "users:read"
        #<string> scope it applies to
        scope: "users:*"
      - action: "users:write"
        scope: "users:*"
      - action: "users:create"
        scope: "users:*"
    # <list> list of teams the role should be assigned to
    teams:
      # <string> name of the team you want to assign the role to
      - name: CustomEditors
        # <int> org id. will default to the role org id
        orgId: 1
    # <list> list of builtIn roles the role should be assigned to
    builtInRoles:
      # <string> name of the builtin role you want to assign the role to
      - name: "Editor"
        # <int> org id. will default to the role org id
        orgId: 1
```

## Supported settings

Check correct values for [permissions]({{< relref "./concepts/permissions.md/#available-permissions" >}}), [built-in role assignments]({{< relref "./concepts/roles.md#built-in-role-assignments" >}})

## Validation rules

(todo update with global roles)

A basic set of validation rules are applied to the input yaml files.

To validate the roles configuration, we:

* Check that the role name is not empty
* Use the [default org ID]({{< relref "../../administration/configuration/#auto_assign_org_id" >}}) if `orgId` is not specified.

To validate team assignments, we:

* Check that the name is not empty
* Inherit the role org ID if `orgId` is not specified
* Check that the `orgId` is the same as the role's, to prevent cross organization assignments

To validate builtin-role assignments, we:

* Check that the name is not empty
* Inherit the role org ID if `orgId` is not specified
* Check that role and builtin-role `orgId` are the same, to prevent cross organization assignments

To validate the roles to delete configuration, we:

* Check that either the role name or uid is provided
* Use the [default org ID]({{< relref "../../administration/configuration/#auto_assign_org_id" >}}) if `orgId` is not specified.