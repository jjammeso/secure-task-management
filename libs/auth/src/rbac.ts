import {Role, User} from '@myorg/data';

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

export class RBACService{
    hasPermission(user:User, permission:Permission):boolean {
        const rolePermissions = ROLE_PERMISSIONS[user.role];
        return rolePermissions.includes(permission);
    }

    
}


export const rbacService = new RBACService();