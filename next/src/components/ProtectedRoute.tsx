import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'ELDOCTORINQUIETO') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Contraseña incorrecta');
        }
    };

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-blue-100 p-3 rounded-full mb-4">
                        <Lock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 text-center">
                        Acceso Restringido
                    </h2>
                    <p className="text-gray-600 text-center mt-2">
                        Por favor, ingresa la contraseña para ver la información georreferenciada.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            autoFocus
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm italic">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProtectedRoute;
