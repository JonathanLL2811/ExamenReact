import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'https://api.escuelajs.co/api/v1/categories';

function App() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', image: '' });
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (error) {
      toast.error('Error al tener las categorias');
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post(API_URL, newCategory);
      setCategories([...categories, response.data]);
      setNewCategory({ name: '', image: '' });
      toast.success('Categoria agregada con exito');
    } catch (error) {
      toast.error('Error al agregar categoria');
    }
  };

  const handleEditCategory = async () => {
    try {
      const response = await axios.put(`${API_URL}/${editingCategory.id}`, editingCategory);
      setCategories(categories.map(cat => (cat.id === editingCategory.id ? response.data : cat)));
      setEditingCategory(null);
      toast.success('Categoria actualizada');
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('quiere borrar la categoria??')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setCategories(categories.filter(cat => cat.id !== id));
        toast.success('se borro con exito');
      } catch (error) {
        toast.error('no se pudo borrar');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1>Categorias CRUD Examen2 React</h1>

      <div className="mb-4">
        <h2>Agregar, editar, borrar.</h2>
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
              value={editingCategory ? editingCategory.name : newCategory.name}
              onChange={(e) => {
                if (editingCategory) {
                  setEditingCategory({ ...editingCategory, name: e.target.value });
                } else {
                  setNewCategory({ ...newCategory, name: e.target.value });
                }
              }}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">URL de la imagen</label>
            <input
              type="text"
              className="form-control"
              value={editingCategory ? editingCategory.image : newCategory.image}
              onChange={(e) => {
                if (editingCategory) {
                  setEditingCategory({ ...editingCategory, image: e.target.value });
                } else {
                  setNewCategory({ ...newCategory, image: e.target.value });
                }
              }}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingCategory ? 'Update Category' : 'agregar nueva categoria'}
          </button>
        </form>
      </div>

      <h2>Lista de Categorias</h2>
      <ul className="list-group">
        {categories.map((category) => (
          <li key={category.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5>{category.name}</h5>
                <img src={category.image} alt={category.name} style={{ width: '100px' }} />
              </div>
              <div>
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setEditingCategory(category)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  borrar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <ToastContainer />
    </div>
  );
}

export default App;
