import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';

// Página que muestra los pedidos del usuario autenticado.
export default function MyOrders() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const data = await orderService.getMisPedidos();
        setOrders(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar pedidos');
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container">
        <h2>Debes iniciar sesión para ver tus pedidos</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p role="alert">{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Mis pedidos</h2>
      {orders.length === 0 ? (
        <p>Aún no tienes pedidos.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {order.fecha
                    ? new Date(order.fecha).toLocaleString('es-AR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })
                    : ''}
                </td>
                <td>{order.estado}</td>
                <td>
                  {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(
                    order.total
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
