import { RBACService, Permission } from "@myorg/auth";
import { User, Task } from "../entities";
import { Role, TaskStatus, TaskCategory } from "@myorg/data";

describe('RBAC Service', () => {
    let rbacService: RBACService;
    let ownerUser: User;
    let adminUser: User;
    let viewerUser: User;
    let task: Task;

    beforeEach(() => {
        rbacService = new RBACService();

        ownerUser = {
            id: '1',
            email: 'owner@test.com',
            firstName: 'Owner',
            lastName: 'User',
            role: Role.OWNER,
            organizationId: 'org-1',
            createdAt: new Date(),
            updatedAt: new Date()
        } as User;

        adminUser = {
            id: '2',
            email: 'admin@test.com',
            firstName: 'Admin',
            lastName: 'User',
            role: Role.ADMIN,
            organizationId: 'org-1',
            createdAt: new Date(),
            updatedAt: new Date()
        } as User;

        viewerUser = {
            id: '3',
            email: 'viewer@test.com',
            firstName: 'Viewer',
            lastName: 'User',
            role: Role.VIEWER,
            organizationId: 'org-1',
            createdAt: new Date(),
            updatedAt: new Date()
        } as User;

        // Create test task
        task = {
            id: 'task-1',
            title: 'Test Task',
            status: TaskStatus.TODO,
            category: TaskCategory.WORK,
            priority: 1,
            createdById: adminUser.id,
            organizationId: 'org-1',
            createdAt: new Date(),
            updatedAt: new Date()
        } as Task;
    });

    describe('hasPermission', () => {
        it('should grant all permissions to owner', () => {
            expect(rbacService.hasPermission(ownerUser.role, Permission.CREATE_TASK)).toBe(true);
            expect(rbacService.hasPermission(ownerUser.role, Permission.DELETE_TASK)).toBe(true);
            expect(rbacService.hasPermission(ownerUser.role, Permission.VIEW_AUDIT_LOG)).toBe(true);
            expect(rbacService.hasPermission(ownerUser.role, Permission.MANAGE_USER)).toBe(true);
        });

        it('should grant limited permissions to admin', () => {
            expect(rbacService.hasPermission(adminUser.role, Permission.CREATE_TASK)).toBe(true);
            expect(rbacService.hasPermission(adminUser.role, Permission.DELETE_TASK)).toBe(true);
            expect(rbacService.hasPermission(adminUser.role, Permission.VIEW_AUDIT_LOG)).toBe(true);
            expect(rbacService.hasPermission(adminUser.role, Permission.MANAGE_USER)).toBe(false);
        });

        it('should grant only read permission to viewer', () => {
            expect(rbacService.hasPermission(viewerUser.role, Permission.READ_TASK)).toBe(true);
            expect(rbacService.hasPermission(viewerUser.role, Permission.CREATE_TASK)).toBe(false);
            expect(rbacService.hasPermission(viewerUser.role, Permission.DELETE_TASK)).toBe(false);
            expect(rbacService.hasPermission(viewerUser.role, Permission.VIEW_AUDIT_LOG)).toBe(false);
        });
    })

    const allOrgs = [
        // Parent organizations (Level 1)
        { id: 'org-1', name: 'Org-1', ownerId: '1', createdAt: new Date(), updatedAt: new Date() },
        { id: 'org-2', name: 'Org-2', ownerId: '1', createdAt: new Date(), updatedAt: new Date() },

        // Child organizations (Level 2)
        { id: 'org-3', name: 'Org-3', ownerId: '1', parentId: 'org-1', createdAt: new Date(), updatedAt: new Date() },
        { id: 'org-4', name: 'Org-4', ownerId: '1', parentId: 'org-2', createdAt: new Date(), updatedAt: new Date() },
        { id: 'org-5', name: 'Org-5', ownerId: '1', parentId: 'org-1', createdAt: new Date(), updatedAt: new Date() },
    ];


    describe('canAccessOrganization', () => {
        it('should allow access to same organization', () => {
            expect(rbacService.canAccessOrganization(viewerUser.organizationId, 'org-1', allOrgs)).toBe(true);
        })

        it('should allow access to child organization', () => {
            expect(rbacService.canAccessOrganization('org-1', 'org-3', allOrgs)).toBe(true);
        })

        it('should deny access to different organization', () => {
            expect(rbacService.canAccessOrganization('org-1', 'org-4', allOrgs)).toBe(false);
        });
    })
})