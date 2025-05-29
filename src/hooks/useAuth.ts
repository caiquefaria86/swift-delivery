import { useState, useEffect } from 'react';

type User = {
  email: string;
  name: string;
} | null;

export function useAuth() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está logado no localStorage
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      // Ignora erros de localStorage (pode ocorrer no SSR)
      console.error('Erro ao acessar localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Simulação de autenticação
    if (email === 'usuario@exemplo.com' && password === 'senha123') {
      const userData = { email, name: 'Usuário Teste' };
      setUser(userData);
      try {
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}