import { Organization, Role, User } from '@myorg/data';

export enum Permission {
    CREATE_TASK = 'create_task',
    READ_TASK = 'read_task',
    UPDATE_TASK = 'update_task',
    DELETE_TASK = 'delete_task',
    VIEW_AUDIT_LOG = 'view_audit_log',
    MANAGE_USERS = 'manage_users'
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    [Role.OWNER]: [
        Permission.CREATE_TASK,
        Permission.READ_TASK,
        Permission.UPDATE_TASK,
        Permission.DELETE_TASK,
        Permission.VIEW_AUDIT_LOG,
        Permission.MANAGE_USERS
    ],
    [Role.ADMIN]: [
        Permission.CREATE_TASK,
        Permission.READ_TASK,
        Permission.UPDATE_TASK,
        Permission.DELETE_TASK,
        Permission.VIEW_AUDIT_LOG
    ],
    [Role.VIEWER]: [
        Permission.READ_TASK
    ]
};

export class RBACService {
    hasPermission(role: Role, permission: Permission): boolean {
        const rolePermissions = ROLE_PERMISSIONS[role];
        return rolePermissions.includes(permission);
    }

    canAccessOrganization(userOrgId: string, targetOrgId: string, allOrgs: Organization[]):boolean {
        if (userOrgId === targetOrgId) return true;

        return this.isChildOrganization(userOrgId, targetOrgId, allOrgs);
    }

    private isChildOrganization(userOrgId: string, targetOrgId: string, allOrgs: Organization[]) {
        const childOrgs = allOrgs.filter(org => org.parentId === userOrgId).map(org => org.id);

        if(childOrgs.length<= 0) return false;
        if(childOrgs.includes(targetOrgId)) return true;

        for(const childId of childOrgs){
            if(this.isChildOrganization(childId, targetOrgId, allOrgs)){
                return true;
            }
        }

        return false;
    }

    getAccessibleOrganizationIds(role:Role, userOrgId:string, allOrgs:Organization[]):string[]{

        const accessibleIds = new Set<string>();

        accessibleIds.add(userOrgId);

        if(role === Role.OWNER || role === Role.ADMIN){
            this.addChildOrganizations(userOrgId, allOrgs, accessibleIds);
        }
        
        return Array.from(accessibleIds);
    }

    private addChildOrganizations(parentId:string, allOrgs:Organization[], accessibleIds:Set<string>):void{
        const children = allOrgs.filter(orgs => orgs.parentId === parentId);

        for(const child of children){
            accessibleIds.add(child.id);
            this.addChildOrganizations(child.id, allOrgs, accessibleIds);
        }
    }

}


export const rbacService = new RBACService();