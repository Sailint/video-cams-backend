const { uploadImage, deleteImage } = require('../config/cloudinary');
const { getAllEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } = require('../models/employeeModel');

const getEmployees = async (req, res) => {
    try {
        const employees = await getAllEmployees();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка получения сотрудников', error: err.message });
    }
};

const getEmployee = async (req, res) => {
    try {
        const employee = await getEmployeeById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Сотрудник не найден' });
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка получения сотрудника', error: err.message });
    }
};

const addEmployee = async (req, res) => {
    try {
        const employeeData = { ...req.body };

        if (req.file) {
            const result = await uploadImage(req.file.buffer);
            employeeData.photo_url = result.secure_url;
        }

        const newEmployee = await createEmployee(employeeData);
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка создания сотрудника', error: err.message });
    }
};

const editEmployee = async (req, res) => {
    try {
        const oldEmployee = await getEmployeeById(req.params.id);
        if (!oldEmployee) return res.status(404).json({ message: 'Сотрудник не найден' });

        const employeeData = { ...req.body };

        if (req.file) {
            // Удаляем старое фото из Cloudinary, если было
            if (oldEmployee.photo_url) {
                await deleteImage(oldEmployee.photo_url);
            }
            const result = await uploadImage(req.file.buffer);
            employeeData.photo_url = result.secure_url;
        } else {
            // Keep existing photo if no new file uploaded
            employeeData.photo_url = oldEmployee.photo_url;
        }

        const updatedEmployee = await updateEmployee(req.params.id, employeeData);
        res.status(200).json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка обновления сотрудника', error: err.message });
    }
};

const removeEmployee = async (req, res) => {
    try {
        const employee = await getEmployeeById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Сотрудник не найден' });

        // Удаляем фото из Cloudinary, если было
        if (employee.photo_url) {
            await deleteImage(employee.photo_url);
        }

        await deleteEmployee(req.params.id);
        res.status(200).json({ message: 'Сотрудник удален' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка удаления сотрудника', error: err.message });
    }
};

module.exports = { getEmployees, getEmployee, addEmployee, editEmployee, removeEmployee };
