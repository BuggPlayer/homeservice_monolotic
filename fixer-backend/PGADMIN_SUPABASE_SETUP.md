# PgAdmin + Supabase Connection Guide

## 🎯 **Complete Setup Guide for PgAdmin with Supabase**

### **Step 1: Get Your Supabase Credentials**

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Navigate to**: Settings → Database
4. **Copy these details**:
   ```
   Host: db.xxxxxxxxxxxxx.supabase.co
   Database name: postgres
   Username: postgres
   Password: [Your actual password]
   Port: 5432
   ```

### **Step 2: Configure PgAdmin for Supabase**

#### **Method 1: Direct Connection**

1. **Open PgAdmin**
2. **Right-click "Servers"** in the left panel
3. **Select "Create" → "Server..."**
4. **Fill in the "General" tab**:
   ```
   Name: Supabase - [Your Project Name]
   ```
5. **Go to "Connection" tab**:
   ```
   Host name/address: db.xxxxxxxxxxxxx.supabase.co
   Port: 5432
   Maintenance database: postgres
   Username: postgres
   Password: [Your actual password]
   ```
6. **Go to "SSL" tab**:
   ```
   SSL mode: Require
   ```
7. **Click "Save"**

#### **Method 2: Connection String**

1. **In PgAdmin**, right-click "Servers"
2. **Select "Create" → "Server..."**
3. **Go to "Advanced" tab**
4. **Paste connection string**:
   ```
   postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres?sslmode=require
   ```

### **Step 3: Navigate to Your Tables**

1. **Expand**: `Supabase - [Your Project Name]`
2. **Expand**: `Databases`
3. **Expand**: `postgres`
4. **Expand**: `Schemas`
5. **Expand**: `public`
6. **Click**: `Tables`

### **Step 4: Troubleshooting Common Issues**

#### **Issue 1: "Server doesn't listen"**
**Solution**: 
- Check if your IP is whitelisted in Supabase
- Go to Supabase Dashboard → Settings → Database → Network Restrictions
- Add your IP address or use "Allow all IPs" for development

#### **Issue 2: "Authentication failed"**
**Solution**:
- Verify your password in Supabase dashboard
- Check if username is exactly "postgres"
- Ensure no extra spaces in credentials

#### **Issue 3: "SSL connection required"**
**Solution**:
- Set SSL mode to "Require" in PgAdmin
- Or add `?sslmode=require` to connection string

#### **Issue 4: "No tables visible"**
**Solution**:
- Tables are in the `public` schema, not `auth`
- Run migrations on your Supabase database
- Check if you're looking in the right schema

### **Step 5: Verify Your Setup**

#### **Check Connection**:
1. **Right-click your server** in PgAdmin
2. **Select "Properties"**
3. **Go to "Connection" tab**
4. **Click "Test"** - should show "Connection successful"

#### **Check Tables**:
1. **Navigate to**: `Server → Databases → postgres → Schemas → public → Tables`
2. **You should see your application tables** (if migrations are run)

### **Step 6: Run Migrations on Supabase**

If you don't see tables, you need to run migrations:

```bash
# Update your .env file with Supabase credentials
# Then run:
npm run migrate
npm run seed
```

### **Step 7: Alternative - Use Supabase Dashboard**

If PgAdmin is giving you trouble:

1. **Go to Supabase Dashboard**
2. **Click "Table Editor"** in the left sidebar
3. **You'll see all your tables there**
4. **Click on any table to view/edit data**

### **Step 8: Connection String Format**

For reference, here's the correct connection string format:

```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?sslmode=require
```

### **Step 9: Environment Variables for Node.js**

Your `.env` file should look like this:

```env
DB_USER=postgres
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_DATABASE=postgres
DB_PASSWORD=your_actual_password
DB_PORT=5432
```

### **Step 10: Test Your Connection**

Run this command to test your connection:

```bash
node test-supabase-connection.js
```

## 🔧 **Common PgAdmin Settings for Supabase**

### **SSL Configuration**:
- **SSL mode**: Require
- **Client certificate**: None
- **Client certificate key**: None
- **Root certificate**: None

### **Advanced Settings**:
- **DB restriction**: Leave empty
- **Password**: Your actual Supabase password
- **Connection timeout**: 0 (unlimited)
- **Login timeout**: 0 (unlimited)

## 🚨 **Security Notes**

1. **Never commit your .env file** to version control
2. **Use environment-specific passwords**
3. **Restrict IP access** in Supabase for production
4. **Use connection pooling** for production applications

## 📞 **Getting Help**

If you're still having issues:

1. **Check Supabase status**: https://status.supabase.com/
2. **Verify project is active** (not paused)
3. **Check your Supabase plan limits**
4. **Review Supabase documentation**: https://supabase.com/docs

## ✅ **Success Checklist**

- [ ] Supabase credentials obtained
- [ ] PgAdmin server created
- [ ] SSL mode set to "Require"
- [ ] Connection test successful
- [ ] Can see `public` schema
- [ ] Tables visible (after running migrations)
- [ ] Node.js connection working
- [ ] API endpoints functional
