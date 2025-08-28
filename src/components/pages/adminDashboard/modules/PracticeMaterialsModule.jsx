import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const PracticeMaterialsModule = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [showPreview, setShowPreview] = useState(null);
  
  // Advanced filters
  const [filters, setFilters] = useState({
    difficulty: '',
    category: '',
    status: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    practiceName: '',
    category: '',
    difficulty: 'beginner',
    description: '',
    signs: [],
    instructions: '',
    estimatedTime: 10,
    points: 10,
    isActive: true
  });

  const [signsInput, setSignsInput] = useState('');
  const [imageFiles, setImageFiles] = useState({});
  const [previewImages, setPreviewImages] = useState({});

  const difficulties = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const queryParams = {
        search: searchTerm,
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== ''))
      };
      const response = await apiService.getPracticeMaterials(queryParams);
      setMaterials(response.data.materials || []);
      setError('');
    } catch (error) {
      console.error('Failed to load practice materials:', error);
      setError('Failed to load practice materials');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      practiceName: '',
      category: '',
      difficulty: 'beginner',
      description: '',
      signs: [],
      instructions: '',
      estimatedTime: 10,
      points: 10,
      isActive: true
    });
    setSignsInput('');
    setImageFiles({});
    setPreviewImages({});
    setShowAddForm(false);
    setEditingMaterial(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSignsInputChange = (e) => {
    const value = e.target.value;
    setSignsInput(value);
    
    const signsArray = value.split(',').map(sign => sign.trim()).filter(sign => sign.length > 0);
    setFormData(prev => ({ ...prev, signs: signsArray }));
  };

  const handleImageUpload = (signName, file) => {
    if (!file) return;

    setImageFiles(prev => ({
      ...prev,
      [signName]: file
    }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImages(prev => ({
        ...prev,
        [signName]: e.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (signName) => {
    setImageFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[signName];
      return newFiles;
    });

    setPreviewImages(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[signName];
      return newPreviews;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.practiceName.trim() || !formData.category.trim() || formData.signs.length === 0) {
      setError('Practice name, category, and signs are required');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        if (key === 'signs') {
          submitData.append(key, formData[key].join(','));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Append image files
      Object.entries(imageFiles).forEach(([signName, file]) => {
        submitData.append(`signImage_${signName}`, file);
        console.log(`Added image for sign: ${signName}`, file.name);
      });

      // Handle existing images for edit mode
      if (editingMaterial && editingMaterial.signImages) {
        const existingImages = editingMaterial.signImages.filter(img => 
          !imageFiles.hasOwnProperty(img.signName)
        );
        submitData.append('existingImages', JSON.stringify(existingImages));
      }

      console.log('Submitting practice material data...');

      let response;
      if (editingMaterial) {
        response = await apiService.updatePracticeMaterial(editingMaterial._id, submitData);
      } else {
        response = await apiService.createPracticeMaterial(submitData);
      }

      console.log('Practice material saved successfully:', response);
      await loadMaterials();
      resetForm();
      setError('');
    } catch (error) {
      console.error('Failed to save practice material:', error);
      setError(error.message || 'Failed to save practice material');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      practiceName: material.practiceName,
      category: material.category,
      difficulty: material.difficulty,
      description: material.description,
      signs: material.signs,
      instructions: material.instructions || '',
      estimatedTime: material.estimatedTime || 10,
      points: material.points || 10,
      isActive: material.isActive
    });
    setSignsInput(material.signs.join(', '));
    
    // Set existing images for preview
    const existingPreviews = {};
    if (material.signImages) {
      material.signImages.forEach(img => {
        existingPreviews[img.signName] = `http://localhost:5001${img.imageUrl}`;
      });
    }
    setPreviewImages(existingPreviews);
    setShowAddForm(true);
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this practice material?')) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deletePracticeMaterial(materialId);
      await loadMaterials();
    } catch (error) {
      console.error('Failed to delete practice material:', error);
      setError('Failed to delete practice material');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadMaterials();
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const applyFilters = () => {
    loadMaterials();
  };

  const clearFilters = () => {
    setFilters({ difficulty: '', category: '', status: '' });
    setSearchTerm('');
    setTimeout(() => loadMaterials(), 0);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMaterials(materials.map(m => m._id));
    } else {
      setSelectedMaterials([]);
    }
  };

  const handleSelectMaterial = (materialId) => {
    setSelectedMaterials(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedMaterials.length === 0) return;
    
    const confirmMessage = `Are you sure you want to delete ${selectedMaterials.length} practice material(s)?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      setLoading(true);
      await Promise.all(
        selectedMaterials.map(id => apiService.deletePracticeMaterial(id))
      );
      setSuccess(`Successfully deleted ${selectedMaterials.length} practice material(s)`);
      setSelectedMaterials([]);
      await loadMaterials();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to delete materials:', error);
      setError('Failed to delete selected materials');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (material) => {
    try {
      setLoading(true);
      const duplicateData = {
        ...material,
        practiceName: `${material.practiceName} (Copy)`,
        isActive: false
      };
      
      // Remove fields that shouldn't be copied
      delete duplicateData._id;
      delete duplicateData.createdAt;
      delete duplicateData.updatedAt;
      delete duplicateData.createdBy;

      await apiService.createPracticeMaterial(duplicateData);
      setSuccess('Practice material duplicated successfully');
      await loadMaterials();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to duplicate material:', error);
      setError('Failed to duplicate practice material');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (material) => {
    setShowPreview(material);
  };

  const closePreview = () => {
    setShowPreview(null);
  };

  const getUniqueCategories = () => {
    const categories = materials.map(m => m.category).filter(Boolean);
    return [...new Set(categories)];
  };

  const exportMaterials = () => {
    const dataToExport = materials.map(material => ({
      practiceName: material.practiceName,
      category: material.category,
      difficulty: material.difficulty,
      description: material.description,
      instructions: material.instructions,
      signs: material.signs,
      estimatedTime: material.estimatedTime,
      points: material.points,
      isActive: material.isActive,
      signImagesCount: material.signImages?.length || 0,
      createdAt: material.createdAt
    }));

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `practice-materials-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div>
      {/* Header with Add Button */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Practice Materials Management</h2>
            <p className="text-gray-600 text-sm mt-1">Manage practice sessions for users</p>
          </div>
          <div className="flex space-x-2">
            {selectedMaterials.length > 0 && (
              <button 
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                onClick={handleBulkDelete}
                disabled={loading}
              >
                Delete Selected ({selectedMaterials.length})
              </button>
            )}
            <button 
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              onClick={exportMaterials}
              disabled={loading || materials.length === 0}
            >
              Export Data
            </button>
            <button 
              className="bg-gradient-to-r from-gray-800 to-black text-white px-4 py-2 rounded-lg font-semibold hover:from-gray-900 hover:to-gray-800 transition-all"
              onClick={() => setShowAddForm(true)}
              disabled={loading}
            >
              + Add New Practice Material
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
          {error}
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">×</button>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
          {success}
          <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700">×</button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Search & Filters</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Search practice materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                <option value="">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button 
                className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                onClick={applyFilters}
                disabled={loading}
              >
                Apply Filters
              </button>
              <button 
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                onClick={clearFilters}
                disabled={loading}
              >
                Clear All
              </button>
            </div>
            <div>
              <span className="text-sm text-gray-600">
                Showing {materials.length} practice material(s)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editingMaterial ? 'Edit Practice Material' : 'Add New Practice Material'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Practice Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                    name="practiceName"
                    value={formData.practiceName}
                    onChange={handleInputChange}
                    placeholder="e.g., Basic Greetings Practice"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Greetings, Numbers, Colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Time (minutes)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                    name="estimatedTime"
                    value={formData.estimatedTime}
                    onChange={handleInputChange}
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Points
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                    name="points"
                    value={formData.points}
                    onChange={handleInputChange}
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Practice instructions for users"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Signs (comma-separated) *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                  value={signsInput}
                  onChange={handleSignsInputChange}
                  placeholder="hello, thank you, please"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter signs separated by commas. Current signs: {formData.signs.length}
                </p>
              </div>

              <div>
                <div className="flex items-center">
                  <input
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Active (visible to users)
                  </label>
                </div>
              </div>

              {/* Image Upload Section */}
              {formData.signs.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sign Images
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.signs.map((sign, index) => (
                      <div key={`${sign}-${index}`} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h6 className="font-medium text-gray-800 mb-2">{sign}</h6>
                        {previewImages[sign] && (
                          <div className="mb-3">
                            <img 
                              src={previewImages[sign]} 
                              alt={sign}
                              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              onClick={() => removeImage(sign)}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(sign, e.target.files[0])}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button 
                  type="button" 
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingMaterial ? 'Update' : 'Create')} Practice Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Materials List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Practice Materials ({materials.length})</h3>
        </div>
        <div className="p-4">
          {loading && <div className="text-center text-gray-600">Loading...</div>}
          {!loading && materials.length === 0 && (
            <div className="text-center text-gray-500">No practice materials found</div>
          )}
          {!loading && materials.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.length === materials.length && materials.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Practice Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signs</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time/Points</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {materials.map((material) => (
                    <tr key={material._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedMaterials.includes(material._id)}
                          onChange={() => handleSelectMaterial(material._id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">{material.practiceName}</div>
                          <div className="text-sm text-gray-500">{material.description}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{material.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          material.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          material.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {material.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{material.signs?.length || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {material.signImages?.map((image, index) => (
                            <img 
                              key={index}
                              src={`http://localhost:5001${image.imageUrl}`}
                              alt={image.signName}
                              className="w-8 h-8 object-cover rounded border border-gray-200"
                              title={image.signName}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {material.estimatedTime}min / {material.points}pts
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          material.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {material.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm text-gray-900">{new Date(material.createdAt).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">
                            {material.createdBy?.firstName} {material.createdBy?.lastName}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-900 text-lg"
                            onClick={() => handlePreview(material)}
                            disabled={loading}
                            title="Preview"
                          >
                            👁️
                          </button>
                          <button 
                            className="text-gray-600 hover:text-gray-900 text-lg"
                            onClick={() => handleEdit(material)}
                            disabled={loading}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-900 text-lg"
                            onClick={() => handleDuplicate(material)}
                            disabled={loading}
                            title="Duplicate"
                          >
                            📋
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900 text-lg"
                            onClick={() => handleDelete(material._id)}
                            disabled={loading}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/5 shadow-lg rounded-lg bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Preview: {showPreview.practiceName}
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={closePreview}
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong className="text-gray-700">Category:</strong> <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full ml-2">{showPreview.category}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Difficulty:</strong>{' '}
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ml-2 ${
                      showPreview.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      showPreview.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {showPreview.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong className="text-gray-700">Estimated Time:</strong> <span className="ml-1">{showPreview.estimatedTime} minutes</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Points:</strong> <span className="ml-1">{showPreview.points} pts</span>
                  </div>
                </div>

                <div>
                  <strong className="text-gray-700">Description:</strong>
                  <p className="mt-2 text-gray-600">{showPreview.description}</p>
                </div>

                {showPreview.instructions && (
                  <div>
                    <strong className="text-gray-700">Instructions:</strong>
                    <p className="mt-2 p-3 bg-blue-50 rounded-lg text-gray-600">{showPreview.instructions}</p>
                  </div>
                )}

                <div>
                  <strong className="text-gray-700">Signs ({showPreview.signs?.length || 0}):</strong>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {showPreview.signs?.map((sign, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-gray-800 text-white rounded-full">{sign}</span>
                    ))}
                  </div>
                </div>

                {showPreview.signImages && showPreview.signImages.length > 0 && (
                  <div>
                    <strong className="text-gray-700">Images ({showPreview.signImages.length}):</strong>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      {showPreview.signImages.map((image, index) => (
                        <div key={index} className="text-center">
                          <img 
                            src={`http://localhost:5001${image.imageUrl}`}
                            alt={image.signName}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 mx-auto"
                          />
                          <div className="text-xs mt-1 text-gray-600">{image.signName}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong className="text-gray-700">Status:</strong>{' '}
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ml-2 ${showPreview.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {showPreview.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Created:</strong> <span className="ml-1 text-gray-600">{new Date(showPreview.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-200">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={closePreview}
              >
                Close
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                onClick={() => {
                  handleEdit(showPreview);
                  closePreview();
                }}
              >
                Edit Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeMaterialsModule;