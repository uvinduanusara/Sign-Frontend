import React, { useState } from "react";
import { Search, Edit, Trash2, Plus, X, Upload, Eye } from "lucide-react";

export default function MaterialsModule({ 
  learningMaterials, 
  loading, 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory,
  onMaterialCreate,
  onMaterialUpdate,
  onMaterialDelete,
  onRefresh
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    learnId: "",
    learnName: "",
    description: "",
    signs: [],
    difficulty: "Beginner",
    correctAnswer: "",
    order: 0,
    isActive: true,
    signImages: []
  });
  const [imageFiles, setImageFiles] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});

  const resetForm = () => {
    setFormData({
      learnId: "",
      learnName: "",
      description: "",
      signs: [],
      difficulty: "Beginner",
      correctAnswer: "",
      order: 0,
      isActive: true,
      signImages: []
    });
    setSignsInput("");
    setImageFiles({});
    setImagePreviews({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const [signsInput, setSignsInput] = useState("");

  const handleSignsChange = (e) => {
    const inputValue = e.target.value;
    setSignsInput(inputValue);
    
    // Only split and process when the input contains actual content
    const signsArray = inputValue.split(',').map(sign => sign.trim()).filter(sign => sign);
    setFormData(prev => ({
      ...prev,
      signs: signsArray
    }));
  };

  const handleImageChange = (signName, event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setImageFiles(prev => ({
        ...prev,
        [signName]: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => ({
          ...prev,
          [signName]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (signName) => {
    setImageFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[signName];
      return newFiles;
    });
    
    setImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[signName];
      return newPreviews;
    });
  };

  const removeExistingImage = (signName) => {
    setFormData(prev => ({
      ...prev,
      signImages: prev.signImages.filter(img => img.signName !== signName)
    }));
  };

  const handleAddMaterial = () => {
    setShowAddModal(true);
    resetForm();
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    const signs = material.signs || [];
    setFormData({
      learnId: material.learnId || "",
      learnName: material.learnName || "",
      description: material.description || "",
      signs: signs,
      difficulty: material.difficulty || "Beginner",
      correctAnswer: material.correctAnswer || "",
      order: material.order || 0,
      isActive: material.isActive !== false,
      signImages: material.signImages || []
    });
    setSignsInput(signs.join(', '));
    setImageFiles({});
    setImagePreviews({});
    setShowEditModal(true);
  };

  const handleDeleteMaterial = (id) => {
    if (window.confirm('Are you sure you want to delete this learning material?')) {
      onMaterialDelete(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Form data:', formData);
    console.log('Image files:', imageFiles);
    
    if (!formData.learnId || !formData.learnName || !formData.description || !formData.correctAnswer) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.signs.length === 0) {
      alert('Please add at least one sign');
      return;
    }

    try {
      const submitData = new FormData();
      
      // Add all form fields
      submitData.append('learnId', formData.learnId);
      submitData.append('learnName', formData.learnName);
      submitData.append('description', formData.description);
      submitData.append('signs', formData.signs.join(','));
      submitData.append('difficulty', formData.difficulty);
      submitData.append('correctAnswer', formData.correctAnswer);
      submitData.append('order', formData.order);
      submitData.append('isActive', formData.isActive);

      // Log what we're adding
      console.log('Added form fields to FormData:', {
        learnId: formData.learnId,
        learnName: formData.learnName,
        description: formData.description,
        signs: formData.signs.join(','),
        difficulty: formData.difficulty,
        correctAnswer: formData.correctAnswer,
        order: formData.order,
        isActive: formData.isActive
      });

      // Add new image files
      Object.entries(imageFiles).forEach(([signName, file]) => {
        submitData.append(`signImage_${signName}`, file);
        console.log(`Added image for sign: ${signName}`, file.name);
      });

      // For edit mode, include existing images to keep
      if (editingMaterial) {
        submitData.append('existingImages', JSON.stringify(formData.signImages));
      }

      // Debug FormData contents (only in development)
      if (process.env.NODE_ENV === 'development') {
        for (let pair of submitData.entries()) {
          console.log('FormData entry:', pair[0], pair[1]);
        }
      }

      if (editingMaterial) {
        await onMaterialUpdate(editingMaterial._id, submitData);
        setShowEditModal(false);
        setEditingMaterial(null);
      } else {
        console.log('Calling onMaterialCreate...');
        await onMaterialCreate(submitData);
        setShowAddModal(false);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving material:', error);
    }
  };

  const filteredMaterials = Array.isArray(learningMaterials) ? learningMaterials.filter(material => {
    if (!material) return false;
    
    const learnName = material.learnName || '';
    const difficulty = material.difficulty || '';
    const status = material.isActive ? 'published' : 'draft';
    
    return (
      (learnName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       difficulty.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "all" || 
       (selectedCategory === "published" && material.isActive) ||
       (selectedCategory === "draft" && !material.isActive))
    );
  }) : [];

  return (
    <div>
      {/* Header with Add Button */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Learning Materials Management</h2>
          <button
            className="bg-gradient-to-r from-gray-800 to-black text-white px-4 py-2 rounded-lg font-semibold hover:from-gray-900 hover:to-gray-800 transition-all"
            onClick={handleAddMaterial}
          >
            <Plus className="inline mr-2 h-4 w-4" /> Add New Material
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Learning Materials</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search materials..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                    Loading materials...
                  </td>
                </tr>
              ) : filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                    No learning materials found
                  </td>
                </tr>
              ) : (
                filteredMaterials.map(material => (
                  <tr key={material._id || material.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {material.learnId || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {material.learnName || 'Untitled'}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {material.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${material.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' : 
                          material.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-800' : 
                          'bg-purple-100 text-purple-800'}`}>
                        {material.difficulty || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {material.signs ? material.signs.join(', ') : 'None'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {material.signImages && material.signImages.length > 0 ? (
                          <>
                            {material.signImages.slice(0, 3).map((image, index) => (
                              <img
                                key={index}
                                src={`http://localhost:5001${image.imageUrl}`}
                                alt={image.signName}
                                className="w-8 h-8 rounded object-cover border"
                                title={image.signName}
                              />
                            ))}
                            {material.signImages.length > 3 && (
                              <div className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-500">
                                +{material.signImages.length - 3}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400 text-sm">No images</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${material.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {material.isActive ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.order || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {material.createdAt ? new Date(material.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => handleEditMaterial(material)}
                        disabled={loading}
                      >
                        <Edit className="h-4 w-4 inline" /> Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteMaterial(material._id || material.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4 inline" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Material Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add New Learning Material</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Learn ID *
                  </label>
                  <input
                    type="text"
                    name="learnId"
                    value={formData.learnId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                    placeholder="e.g., learn1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Learn Name *
                  </label>
                  <input
                    type="text"
                    name="learnName"
                    value={formData.learnName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                    placeholder="e.g., Basic Greetings"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                  placeholder="Describe what this lesson teaches..."
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Signs * (comma-separated)
                </label>
                <input
                  type="text"
                  value={signsInput}
                  onChange={handleSignsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                  placeholder="e.g., hello, thanks, goodbye"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple signs with commas
                  {formData.signs.length > 0 && (
                    <span className="ml-2 text-blue-600">
                      ({formData.signs.length} sign{formData.signs.length !== 1 ? 's' : ''} detected)
                    </span>
                  )}
                </p>
              </div>

              {/* Sign Images Section */}
              {formData.signs.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sign Images (optional)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.signs.map((sign, index) => (
                      <div key={`${sign}-${index}`} className="border border-gray-300 rounded-lg p-3">
                        <h4 className="font-medium text-gray-800 mb-2 capitalize">{sign}</h4>
                        
                        {/* Show existing images for edit mode */}
                        {editingMaterial && formData.signImages.find(img => img.signName === sign) && (
                          <div className="mb-2">
                            <img
                              src={`http://localhost:5001${formData.signImages.find(img => img.signName === sign).imageUrl}`}
                              alt={`${sign} existing`}
                              className="w-20 h-20 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(sign)}
                              className="mt-1 text-red-600 text-xs hover:text-red-800 block"
                            >
                              Remove Existing
                            </button>
                          </div>
                        )}
                        
                        {/* Show preview if new image exists */}
                        {imagePreviews[sign] && (
                          <div className="mb-2">
                            <img
                              src={imagePreviews[sign]}
                              alt={`${sign} preview`}
                              className="w-20 h-20 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(sign)}
                              className="mt-1 text-red-600 text-xs hover:text-red-800"
                            >
                              Remove New
                            </button>
                          </div>
                        )}
                        
                        {/* Upload button */}
                        {!imagePreviews[sign] && (
                          <div>
                            <input
                              type="file"
                              id={`${editingMaterial ? 'edit' : 'add'}-image-${sign}-${index}`}
                              accept="image/*"
                              onChange={(e) => handleImageChange(sign, e)}
                              className="hidden"
                            />
                            <label
                              htmlFor={`${editingMaterial ? 'edit' : 'add'}-image-${sign}-${index}`}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              {editingMaterial && formData.signImages.find(img => img.signName === sign) ? 'Replace Image' : 'Upload Image'}
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Images help users understand the signs better. Max 5MB per image.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer *
                  </label>
                  <input
                    type="text"
                    name="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                    placeholder="Expected answer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Published (visible to users)
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-md hover:from-gray-900 hover:to-gray-800"
                >
                  Create Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Material Modal */}
      {showEditModal && editingMaterial && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit Learning Material</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingMaterial(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Learn ID *
                  </label>
                  <input
                    type="text"
                    name="learnId"
                    value={formData.learnId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                    placeholder="e.g., learn1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Learn Name *
                  </label>
                  <input
                    type="text"
                    name="learnName"
                    value={formData.learnName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                    placeholder="e.g., Basic Greetings"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                  placeholder="Describe what this lesson teaches..."
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Signs * (comma-separated)
                </label>
                <input
                  type="text"
                  value={signsInput}
                  onChange={handleSignsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                  placeholder="e.g., hello, thanks, goodbye"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple signs with commas
                  {formData.signs.length > 0 && (
                    <span className="ml-2 text-blue-600">
                      ({formData.signs.length} sign{formData.signs.length !== 1 ? 's' : ''} detected)
                    </span>
                  )}
                </p>
              </div>

              {/* Sign Images Section */}
              {formData.signs.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sign Images (optional)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.signs.map((sign, index) => (
                      <div key={`${sign}-${index}`} className="border border-gray-300 rounded-lg p-3">
                        <h4 className="font-medium text-gray-800 mb-2 capitalize">{sign}</h4>
                        
                        {/* Show existing images for edit mode */}
                        {editingMaterial && formData.signImages.find(img => img.signName === sign) && (
                          <div className="mb-2">
                            <img
                              src={`http://localhost:5001${formData.signImages.find(img => img.signName === sign).imageUrl}`}
                              alt={`${sign} existing`}
                              className="w-20 h-20 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(sign)}
                              className="mt-1 text-red-600 text-xs hover:text-red-800 block"
                            >
                              Remove Existing
                            </button>
                          </div>
                        )}
                        
                        {/* Show preview if new image exists */}
                        {imagePreviews[sign] && (
                          <div className="mb-2">
                            <img
                              src={imagePreviews[sign]}
                              alt={`${sign} preview`}
                              className="w-20 h-20 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(sign)}
                              className="mt-1 text-red-600 text-xs hover:text-red-800"
                            >
                              Remove New
                            </button>
                          </div>
                        )}
                        
                        {/* Upload button */}
                        {!imagePreviews[sign] && (
                          <div>
                            <input
                              type="file"
                              id={`${editingMaterial ? 'edit' : 'add'}-image-${sign}-${index}`}
                              accept="image/*"
                              onChange={(e) => handleImageChange(sign, e)}
                              className="hidden"
                            />
                            <label
                              htmlFor={`${editingMaterial ? 'edit' : 'add'}-image-${sign}-${index}`}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              {editingMaterial && formData.signImages.find(img => img.signName === sign) ? 'Replace Image' : 'Upload Image'}
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Images help users understand the signs better. Max 5MB per image.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer *
                  </label>
                  <input
                    type="text"
                    name="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                    placeholder="Expected answer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Published (visible to users)
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMaterial(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-md hover:from-gray-900 hover:to-gray-800"
                >
                  Update Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}