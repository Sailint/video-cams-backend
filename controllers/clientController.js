const fs = require('fs');
const path = require('path');
const { getAllClients, getClientById, createClient, updateClient, deleteClient } = require('../models/clientModel');

const getClients = async (req, res) => {
    try {
        const clients = await getAllClients();
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка получения клиентов', error: err.message });
    }
};

const getClient = async (req, res) => {
    try {
        const client = await getClientById(req.params.id);
        if (!client) return res.status(404).json({ message: 'Клиент не найден' });
        res.status(200).json(client);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка получения клиента', error: err.message });
    }
};

const addClient = async (req, res) => {
    try {
        const clientData = { ...req.body };

        if (req.file) {
            clientData.photo_url = `/uploads/${req.file.filename}`;
        }

        const newClient = await createClient(clientData);
        res.status(201).json(newClient);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка создания клиента', error: err.message });
    }
};

const editClient = async (req, res) => {
    try {
        const oldClient = await getClientById(req.params.id);
        if (!oldClient) return res.status(404).json({ message: 'Клиент не найден' });

        const clientData = { ...req.body };

        if (req.file) {
            if (oldClient.photo_url && oldClient.photo_url.startsWith('/uploads/')) {
                const oldPath = path.join(__dirname, '..', oldClient.photo_url);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            clientData.photo_url = `/uploads/${req.file.filename}`;
        } else {
            clientData.photo_url = oldClient.photo_url;
        }

        const updatedClient = await updateClient(req.params.id, clientData);
        res.status(200).json(updatedClient);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка обновления клиента', error: err.message });
    }
};

const removeClient = async (req, res) => {
    try {
        const client = await getClientById(req.params.id);
        if (!client) return res.status(404).json({ message: 'Клиент не найден' });

        if (client.photo_url && client.photo_url.startsWith('/uploads/')) {
            const photoPath = path.join(__dirname, '..', client.photo_url);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }

        await deleteClient(req.params.id);
        res.status(200).json({ message: 'Клиент удален' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка удаления клиента', error: err.message });
    }
};

module.exports = { getClients, getClient, addClient, editClient, removeClient };
