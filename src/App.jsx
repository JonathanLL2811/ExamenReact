import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap'; // Importa Modal y Button de react-bootstrap
import './App.css';


const API_URL = 'https://api.escuelajs.co/api/v1/categories';

function App() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', image: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (error) {
      toast.error('Error al obtener las categorias');
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post(API_URL, newCategory);
      setCategories([...categories, response.data]);
      setShowModal(false);
      toast.success('Categoría agregada con éxito');
    } catch (error) {
      toast.error('Error al agregar categoría');
    }
  };

  const handleEditCategory = async () => {
    try {
      const response = await axios.put(`${API_URL}/${editingCategory.id}`, editingCategory);
      setCategories(categories.map(cat => (cat.id === editingCategory.id ? response.data : cat)));
      setEditingCategory(null);
      setShowModal(false);
      toast.success('Categoría actualizada');
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('¿Desea borrar la categoría?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setCategories(categories.filter(cat => cat.id !== id));
        toast.success('Categoría eliminada con éxito');
      } catch (error) {
        toast.error('No se pudo borrar');
      }
    }
  };

  const handleShowModal = (category = null) => {
    setEditingCategory(category);
    setNewCategory(category || { name: '', image: '' });
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h1>Categorías CRUD Examen2 React</h1>

      <Button variant="primary" onClick={() => handleShowModal()}>
        Agregar Nueva Categoría
      </Button>

      <h2 className="mt-4">Lista de Categorías</h2>
      <ul className="list-group">
        {categories.map((category) => (
          <li key={category.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5>{category.name}</h5>
                <img src={category.image} alt={category.name} style={{ width: '100px' }} />
              </div>
              <div>
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={() => handleShowModal(category)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  Borrar
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal para agregar/editar categoría */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingCategory ? 'Editar Categoría' : 'Agregar Categoría'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editingCategory ? handleEditCategory() : handleAddCategory();
            }}
          >
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">URL de la imagen</label>
              <input
                type="text"
                className="form-control"
                value={newCategory.image}
                onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                required
              />
            </div>
            <Button type="submit" variant="primary">
              {editingCategory ? 'Actualizar Categoría' : 'Agregar Categoría'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default App;
