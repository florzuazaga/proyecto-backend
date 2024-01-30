// modelOperations.js

async function create(model, data) {
    try {
      const newEntity = await model.create(data);
      return newEntity;
    } catch (error) {
      throw new Error(`Error al crear la entidad: ${error.message}`);
    }
  }
  
  async function getById(model, entityId) {
    try {
      const entity = await model.findById(entityId);
      if (!entity) {
        throw new Error('Entidad no encontrada');
      }
      return entity;
    } catch (error) {
      throw new Error(`Error al obtener la entidad por ID: ${error.message}`);
    }
  }
  
  async function updateById(model, entityId, updatedData) {
    try {
      const updatedEntity = await model.findByIdAndUpdate(entityId, updatedData, { new: true });
      if (!updatedEntity) {
        throw new Error('Entidad no encontrada');
      }
      return updatedEntity;
    } catch (error) {
      throw new Error(`Error al actualizar la entidad por ID: ${error.message}`);
    }
  }
  
  async function deleteById(model, entityId) {
    try {
      const deletedEntity = await model.findByIdAndDelete(entityId);
      if (!deletedEntity) {
        throw new Error('Entidad no encontrada');
      }
      return deletedEntity;
    } catch (error) {
      throw new Error(`Error al eliminar la entidad por ID: ${error.message}`);
    }
  }
  
  module.exports = { create, getById, updateById, deleteById };
  