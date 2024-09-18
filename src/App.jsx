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
      toast.error('Error fetching categories');
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post(API_URL, newCategory);
      setCategories([...categories, response.data]);
      setNewCategory({ name: '', image: '' });
      toast.success('Category added successfully');
    } catch (error) {
      toast.error('Error adding category');
    }
  };

  const handleEditCategory = async () => {
    try {
      const response = await axios.put(`${API_URL}/${editingCategory.id}`, editingCategory);
      setCategories(categories.map(cat => (cat.id === editingCategory.id ? response.data : cat)));
      setEditingCategory(null);
      toast.success('Category updated successfully');
    } catch (error) {
      toast.error('Error updating category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setCategories(categories.filter(cat => cat.id !== id));
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Error deleting category');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1>Categories CRUD</h1>

      <div className="mb-4">
        <h2>Add/Edit Category</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editingCategory ? handleEditCategory() : handleAddCategory();
          }}
        >
          <div className="mb-3">
            <label className="form-label">Name</label>
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
            <label className="form-label">Image URL</label>
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
            {editingCategory ? 'Update Category' : 'Add Category'}
          </button>
        </form>
      </div>

      <h2>Categories List</h2>
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
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteCategory(category.id)}
                >
                  Delete
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
