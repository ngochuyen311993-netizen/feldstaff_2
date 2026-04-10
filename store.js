// store.js - Quản lý Data (LocalStorage)
const DB_EMPLOYEES = 'paymaster_employees';
const DB_ATTENDANCE = 'paymaster_attendance';

export const Store = {
    // ---- NHÂN VIÊN ----
    getEmployees() {
        const data = localStorage.getItem(DB_EMPLOYEES);
        return data ? JSON.parse(data) : [];
    },

    saveEmployee(employee) {
        const employees = this.getEmployees();
        if (employee.id) {
            // Edit
            const index = employees.findIndex(e => e.id === employee.id);
            if (index > -1) employees[index] = employee;
        } else {
            // Add
            employee.id = 'EMP_' + Date.now();
            employees.push(employee);
        }
        localStorage.setItem(DB_EMPLOYEES, JSON.stringify(employees));
    },

    deleteEmployee(id) {
        let employees = this.getEmployees();
        employees = employees.filter(e => e.id !== id);
        localStorage.setItem(DB_EMPLOYEES, JSON.stringify(employees));
    },

    // ---- CHẤM CÔNG ----
    getAttendanceByDate(date) {
        const data = localStorage.getItem(DB_ATTENDANCE);
        const allRecords = data ? JSON.parse(data) : {};
        return allRecords[date] || {}; // { empId: { status, note } }
    },

    saveAttendance(date, employeeId, status, note) {
        const data = localStorage.getItem(DB_ATTENDANCE);
        const allRecords = data ? JSON.parse(data) : {};
        
        if (!allRecords[date]) {
            allRecords[date] = {};
        }
        
        allRecords[date][employeeId] = { status, note };
        localStorage.setItem(DB_ATTENDANCE, JSON.stringify(allRecords));
    },

    // ---- LƯƠNG ----
    getPayroll(monthPrefix) { // monthPrefix: 'YYYY-MM'
        const employees = this.getEmployees();
        const data = localStorage.getItem(DB_ATTENDANCE);
        const allRecords = data ? JSON.parse(data) : {};
        
        // Lọc ngày theo tháng
        const monthRecords = Object.keys(allRecords).filter(date => date.startsWith(monthPrefix));
        
        const payrollResult = employees.map(emp => {
            let workingDays = 0;
            
            monthRecords.forEach(date => {
                const record = allRecords[date][emp.id];
                if (record) {
                    if (record.status === 'FULL') workingDays += 1;
                    if (record.status === 'HALF') workingDays += 0.5;
                    // Lễ có lương...
                }
            });

            const total = workingDays * emp.salary;

            return {
                ...emp,
                workingDays,
                totalSalary: total
            };
        });

        return payrollResult;
    }
};
