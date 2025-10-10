#!/usr/bin/env node

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_DATABASE || 'fixer_marketplace',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function checkRBAC() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking RBAC system status...');
    
    // Check roles
    const roles = await client.query('SELECT * FROM roles ORDER BY name');
    console.log('📋 Roles found:', roles.rows.length);
    roles.rows.forEach(role => {
      console.log(`  - ${role.name}: ${role.description}`);
    });
    
    // Check permissions
    const permissions = await client.query('SELECT COUNT(*) as count FROM permissions');
    console.log('🔐 Total permissions:', permissions.rows[0].count);
    
    // Check role permissions
    const rolePermissions = await client.query(`
      SELECT r.name as role_name, COUNT(rp.permission_id) as permission_count
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id AND rp.granted = true
      GROUP BY r.id, r.name
      ORDER BY r.name
    `);
    console.log('🔗 Role permissions:');
    rolePermissions.rows.forEach(rp => {
      console.log(`  - ${rp.role_name}: ${rp.permission_count} permissions`);
    });
    
    // Check if super admin exists
    const superAdmin = await client.query('SELECT * FROM users WHERE email = $1', ['superadmin@fixer.com']);
    if (superAdmin.rows.length > 0) {
      console.log('👑 Super admin exists:', superAdmin.rows[0].email);
      
      // Check super admin roles
      const superAdminRoles = await client.query(`
        SELECT r.name
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = $1 AND ur.is_active = true
      `, [superAdmin.rows[0].id]);
      
      console.log('👑 Super admin roles:', superAdminRoles.rows.map(r => r.name));
    } else {
      console.log('❌ Super admin not found');
    }
    
    // Check pending approvals
    const pendingApprovals = await client.query('SELECT COUNT(*) as count FROM user_approvals WHERE status = $1', ['pending']);
    console.log('⏳ Pending user approvals:', pendingApprovals.rows[0].count);
    
  } catch (error) {
    console.error('❌ Error checking RBAC:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkRBAC();
