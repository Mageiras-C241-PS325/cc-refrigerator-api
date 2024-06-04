const recognizeIngredients = (request, h) => {
  const response = h.response({
    status: 'success'
  })

  response.code(201);
  return response;
};
 
const login = (request, h) => {
  const response = h.response({
    status: 'success'
  })

  response.code(201);
  return response;
};
 
const register = (request, h) => {
  const response = h.response({
    status: 'success'
  })

  response.code(201);
  return response;
};

const logout = (request, h) => {
  const response = h.response({
    status: 'success'
  })

  response.code(201);
  return response;
};
 
const addIngredient = (request, h) => {
  const response = h.response({
    status: 'success'
  })

  response.code(201);
  return response;
};
 
const deleteIngredient = (request, h) => {
  const response = h.response({
    status: 'success'
  })

  response.code(201);
  return response;
};

const deleteAllIngredients = (request, h) => {
  const response = h.response({
    status: 'success'
  })

  response.code(201);
  return response;
};
 
const showIngredients = (request, h) => {
  const response = h.response({
    status: 'success'
  })

  response.code(201);
  return response;
};
 
const showDetailIngredient = (request, h) => {
  const response = h.response({
    status: 'success'
  })

  response.code(201);
  return response;
};

const updateIngredient = (request, h) => {
  const response = h.response({
    status: 'success'
  })

  response.code(201);
  return response;
};
 
const addMenu = (request, h) => {
  const response = h.response({
    status: 'success'
  })

  response.code(201);
  return response;
};
 
const recommendMenu = (request, h) => {
  const response = h.response({
    status: 'success'
  })

  response.code(201);
  return response;
};
 
module.exports = { 
  recognizeIngredients,
  login,
  register,
  logout,
  addIngredient,
  deleteIngredient,
  deleteAllIngredients,
  showIngredients,
  showDetailIngredient,
  updateIngredient,
  addMenu,
  recommendMenu
 };