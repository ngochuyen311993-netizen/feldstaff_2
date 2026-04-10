import { Store } from './store.js';

document.addEventListener('DOMContentLoaded', () => {
    // Layout Navigation
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            navBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));
            
            // Add active
            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            document.getElementById(`${target}-tab`).classList.add('active');

            // Refresh data on switch
            if (target === 'employees') renderEmployees();
            if (target === 'attendance') {
                document.getElementById('attendance-date').valueAsDate = new Date();
                renderAttendance();
            }
            if (target === 'payroll') {
                const now = new Date();
                const month = now.toISOString().slice(0, 7); // YYYY-MM
                document.getElementById('payroll-month').value = month;
                renderPayroll();
            }
        });
    });

    // --- EMPLOYEE MODULE ---
    const modal = document.getElementById('employee-modal');
    const btnAdd = document.getElementById('btn-add-employee');
    const btnClose = document.getElementById('btn-close-modal');
    const btnCancel = document.getElementById('btn-cancel');
    const empForm = document.getElementById('employee-form');

    const openModal = () => modal.classList.add('active');
    const closeModal = () => {
        modal.classList.remove('active');
        empForm.reset();
        document.getElementById('emp-id').value = '';
    };

    btnAdd.addEventListener('click', openModal);
    btnClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);

    empForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('emp-id').value;
        const employee = {
            id: id || null,
            code: document.getElementById('emp-code').value,
            name: document.getElementById('emp-name').value,
            dept: document.getElementById('emp-dept').value,
            role: document.getElementById('emp-role').value,
            salary: parseInt(document.getElementById('emp-salary').value)
        };

        Store.saveEmployee(employee);
        closeModal();
        renderEmployees();
    });

    // Global func for edit/delete
    window.editEmployee = (id) => {
        const emp = Store.getEmployees().find(e => e.id === id);
        if (emp) {
            document.getElementById('emp-id').value = emp.id;
            document.getElementById('emp-code').value = emp.code;
            document.getElementById('emp-name').value = emp.name;
            document.getElementById('emp-dept').value = emp.dept;
            document.getElementById('emp-role').value = emp.role;
            document.getElementById('emp-salary').value = emp.salary;
            document.getElementById('modal-title').innerText = 'Sửa Nhân Viên';
            openModal();
        }
    };

    window.deleteEmployee = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
            Store.deleteEmployee(id);
            renderEmployees();
        }
    };

    function renderEmployees() {
        const list = Store.getEmployees();
        const tbody = document.getElementById('employee-list-body');
        const emptyState = document.getElementById('empty-employee-state');
        
        tbody.innerHTML = '';
        if (list.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            list.forEach(emp => {
                const fSal = new Intl.NumberFormat('vi-VN').format(emp.salary);
                tbody.innerHTML += `
                    <tr>
                        <td><strong>${emp.code}</strong></td>
                        <td>${emp.name}</td>
                        <td>${emp.dept || '-'}</td>
                        <td>${emp.role || '-'}</td>
                        <td>${fSal}</td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="editEmployee('${emp.id}')">Sửa</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${emp.id}')">Xóa</button>
                        </td>
                    </tr>
                `;
            });
        }
    }

    // --- ATTENDANCE MODULE ---
    const dateInput = document.getElementById('attendance-date');
    dateInput.addEventListener('change', renderAttendance);

    function renderAttendance() {
        const date = document.getElementById('attendance-date').value;
        if (!date) return;
        
        const emps = Store.getEmployees();
        const records = Store.getAttendanceByDate(date);
        const tbody = document.getElementById('attendance-list-body');
        const emptyState = document.getElementById('empty-attendance-state');

        tbody.innerHTML = '';
        if (emps.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            emps.forEach(emp => {
                const rec = records[emp.id] || { status: 'FULL', note: '' }; // default
                tbody.innerHTML += `
                    <tr>
                        <td>${emp.code}</td>
                        <td><strong>${emp.name}</strong></td>
                        <td>
                            <select class="status-select input-field sub-element" id="status_${emp.id}">
                                <option value="FULL" ${rec.status === 'FULL' ? 'selected' : ''}>✅ Có mặt (1 công)</option>
                                <option value="HALF" ${rec.status === 'HALF' ? 'selected' : ''}>🌗 Nửa ngày (0.5 công)</option>
                                <option value="ABSENT" ${rec.status === 'ABSENT' ? 'selected' : ''}>❌ Vắng mặt</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" class="input-field sub-element" id="note_${emp.id}" value="${rec.note}" placeholder="Lý do..." />
                        </td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="saveRecord('${emp.id}')">Lưu</button>
                            <span style="color:var(--success); font-size:12px; margin-left:8px;" id="msg_${emp.id}"></span>
                        </td>
                    </tr>
                `;
            });
        }
    }

    window.saveRecord = (empId) => {
        const date = document.getElementById('attendance-date').value;
        const status = document.getElementById(`status_${empId}`).value;
        const note = document.getElementById(`note_${empId}`).value;
        Store.saveAttendance(date, empId, status, note);
        
        const msg = document.getElementById(`msg_${empId}`);
        msg.innerText = "Đã lưu!";
        setTimeout(() => msg.innerText = "", 2000);
    };

    // --- PAYROLL MODULE ---
    const payrollMonth = document.getElementById('payroll-month');
    payrollMonth.addEventListener('change', renderPayroll);

    function renderPayroll() {
        const month = payrollMonth.value; // YYYY-MM
        if (!month) return;

        const result = Store.getPayroll(month);
        const tbody = document.getElementById('payroll-list-body');
        const emptyState = document.getElementById('empty-payroll-state');
        const totalAmountEl = document.getElementById('total-payroll-amount');

        tbody.innerHTML = '';
        let totalFund = 0;

        if (result.length === 0) {
            emptyState.classList.remove('hidden');
            totalAmountEl.innerText = '0 đ';
        } else {
            emptyState.classList.add('hidden');
            result.forEach(row => {
                const fBase = new Intl.NumberFormat('vi-VN').format(row.salary);
                const fTotal = new Intl.NumberFormat('vi-VN').format(row.totalSalary);
                totalFund += row.totalSalary;

                tbody.innerHTML += `
                    <tr>
                        <td>${row.code}</td>
                        <td><strong>${row.name}</strong></td>
                        <td>${fBase}</td>
                        <td><span style="background:var(--success-bg); padding:4px 8px; border-radius:4px;">${row.workingDays}</span></td>
                        <td><strong style="color:var(--danger);">${fTotal} đ</strong></td>
                    </tr>
                `;
            });
            totalAmountEl.innerText = new Intl.NumberFormat('vi-VN').format(totalFund) + ' đ';
        }
    }

    // Init App
    renderEmployees();
});
