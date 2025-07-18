import { ArrowLeft, DollarSign, FileText, MapPin, Phone, Tag } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

export function CreateOffer() {
  const { addOffer, updateOffer, selectedOffer, setCurrentPage, setSelectedOffer, currentUser } = useApp();

  const [formData, setFormData] = useState({
    id: '',
    userId: '',
    title: '',
    category: 'producto' as 'producto' | 'servicio' | 'conocimiento',
    description: '',
    location: '',
    imageUrl: '',
    whatsappNumber: '',
    exchangeValue: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Detectar si estamos editando
  useEffect(() => {
    if (selectedOffer) {
      setFormData({
        ...selectedOffer,
        userId: selectedOffer.userId || currentUser.id // Asegura el userId
      });
      setIsEditing(true);
    } else {
      // Resetear para nueva oferta
      setFormData({
        id: '',
        userId: currentUser.id,
        title: '',
        category: 'producto',
        description: '',
        location: '',
        imageUrl: '',
        whatsappNumber: '',
        exchangeValue: ''
      });
      setIsEditing(false);
      //Nueva oferta
    }
  }, [selectedOffer, currentUser.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      id: isEditing ? formData.id : crypto.randomUUID(),
      userId: currentUser.id
    };

    const submitData = (data: typeof formData) => {
      if (isEditing) {
        updateOffer(data);
      } else {
        addOffer(data);
      }
      setSelectedOffer(null); // Limpiar para futuras creaciones
      setCurrentPage('dashboard');
    };

    if (imageFile) {
  const reader = new FileReader();
  reader.onloadend = () => {
    const base64Image = reader.result as string;
    submitData({ ...finalData, imageUrl: base64Image });
  };
  reader.readAsDataURL(imageFile);
} else {
  submitData(finalData); // Usa imageUrl si fue ingresada manualmente
}
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, imageUrl: URL.createObjectURL(file) });
    }
  };

  const handleCancel = () => {
    setSelectedOffer(null);
    setCurrentPage('dashboard');
  };

  const categoryColors = {
    producto: 'bg-blue-100 text-blue-800',
    servicio: 'bg-green-100 text-green-800',
    conocimiento: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={handleCancel}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver al Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Oferta' : 'Publicar Nueva Oferta'}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título de la Oferta *
              </label>
              <div className="relative">
                <FileText className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
              <div className="relative">
                <Tag className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none"
                  required
                >
                  <option value="producto">Producto</option>
                  <option value="servicio">Servicio</option>
                  <option value="conocimiento">Conocimiento</option>
                </select>
              </div>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[formData.category]}`}>
                  {formData.category}
                </span>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Ubicación */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Ubicación *</label>
              <div className="relative">
                <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-2">Número de WhatsApp *</label>
              <div className="relative">
                <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Imagen */}
            <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de la Oferta</label>

  {/* Subida de imagen local */}
  <input
    type="file"
    accept="image/*"
    id="imageFile"
    onChange={handleImageChange}
    className="block w-full mb-3 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg"
  />

  {/* O ingresar URL de imagen */}
  <input
    type="url"
    id="imageUrl"
    name="imageUrl"
    value={formData.imageUrl}
    onChange={handleInputChange}
    placeholder="https://ejemplo.com/imagen.jpg"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
  />

  {/* Vista previa de la imagen */}
  {formData.imageUrl && (
    <img
      src={formData.imageUrl}
      alt="Vista previa"
      className="mt-4 w-32 h-32 object-cover rounded-lg"
    />
  )}
</div>

            {/* Valor de intercambio */}
            <div>
              <label htmlFor="exchangeValue" className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué aceptas a cambio? *
              </label>
              <div className="relative">
                <DollarSign className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  id="exchangeValue"
                  name="exchangeValue"
                  value={formData.exchangeValue}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold"
              >
                {isEditing ? 'Actualizar Oferta' : 'Publicar Oferta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
