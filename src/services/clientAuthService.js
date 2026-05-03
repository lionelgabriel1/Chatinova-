import api from './api';

export const clientAuthService = {
  /**
   * Login do cliente
   */
  async loginCliente(email, senha) {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        senha
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao fazer login');
      }

      const { token, cliente } = response.data;

      // Salvar token e dados do cliente
      localStorage.setItem('client_token', token);
      localStorage.setItem('cliente_data', JSON.stringify(cliente));

      return cliente;
    } catch (error) {
      console.error('Erro login cliente:', error.message);
      throw new Error(error.response?.data?.error || error.message || 'Erro ao fazer login');
    }
  },

  /**
   * Cadastro de novo cliente
   */
  async cadastrarCliente(clienteData) {
    try {
      const { email, senha, nome, sobrenome, telefone, cpf } = clienteData;

      const response = await api.post('/api/auth/register', {
        email,
        senha,
        nome,
        sobrenome,
        telefone,
        cpf
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao registrar');
      }

      return response.data;
    } catch (error) {
      console.error('Erro cadastro cliente:', error.message);
      throw new Error(error.response?.data?.error || error.message || 'Erro ao registrar');
    }
  },

  /**
   * Obter dados do cliente autenticado
   */
  async getClienteLogado() {
    try {
      const response = await api.get('/api/auth/me');
      
      if (response.data.success) {
        return response.data.user;
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter cliente:', error.message);
      return null;
    }
  },

  /**
   * Logout do cliente
   */
  async logoutCliente() {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.warn('Erro ao fazer logout:', error.message);
    } finally {
      localStorage.removeItem('client_token');
      localStorage.removeItem('cliente_data');
      window.location.href = '/login';
    }
  },

  /**
   * Verificar se cliente está autenticado
   */
  isAutenticado() {
    return !!localStorage.getItem('client_token');
  },

  /**
   * Obter token do cliente
   */
  getToken() {
    return localStorage.getItem('client_token');
  }
};
