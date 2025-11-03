import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import './OrderManagement.css';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEstado, setFilterEstado] = useState('TODOS');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const estadosPedido = ['PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

  useEffect(() => {
    loadOrders();
  }, [filterEstado]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      let data;
      if (filterEstado === 'TODOS') {
        data = await orderService.getAllPedidos();
      } else {
        data = await orderService.getPedidosByEstado(filterEstado);
      }
      setOrders(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEstado = async (orderId, nuevoEstado) => {
    try {
      setUpdatingOrderId(orderId);
      await orderService.updateEstadoPedido(orderId, nuevoEstado);
      await loadOrders();
      alert('Estado del pedido actualizado');
    } catch (err) {
      alert(err.message || 'Error al actualizar estado');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('¿Estás seguro de eliminar este pedido?')) {
      return;
    }

    try {
      await orderService.deletePedido(orderId);
      await loadOrders();
      alert('Pedido eliminado');
    } catch (err) {
      alert(err.message || 'Error al eliminar pedido');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const getEstadoBadgeClass = (estado) => {
    const classes = {
      PENDIENTE: 'badge-warning',
      CONFIRMADO: 'badge-info',
      ENVIADO: 'badge-primary',
      ENTREGADO: 'badge-success',
      CANCELADO: 'badge-danger'
    };
    return classes[estado] || 'badge-secondary';
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      PENDIENTE: 'Pendiente',
      CONFIRMADO: 'Confirmado',
      ENVIADO: 'Enviado',
      ENTREGADO: 'Entregado',
      CANCELADO: 'Cancelado'
    };
    return labels[estado] || estado;
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return <div className="loading-state">Cargando pedidos...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div className="order-management">
      <div className="management-header">
        <h2>Gestión de Pedidos</h2>
        <div className="filter-controls">
          <label>Filtrar por estado:</label>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="filter-select"
          >
            <option value="TODOS">Todos</option>
            {estadosPedido.map((estado) => (
              <option key={estado} value={estado}>
                {getEstadoLabel(estado)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>No hay pedidos {filterEstado !== 'TODOS' && `con estado "${getEstadoLabel(filterEstado)}"`}</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="admin-order-card">
              <div className="order-header" onClick={() => toggleOrderDetails(order.id)}>
                <div className="order-info">
                  <h3>Pedido #{order.id}</h3>
                  <span className="order-date">{formatDate(order.fechaPedido || order.fecha)}</span>
                  <span className="order-user">Cliente: {order.usuarioNombre || `ID: ${order.usuarioId}`}</span>
                </div>
                <div className="order-summary">
                  <span className={`order-badge ${getEstadoBadgeClass(order.estado)}`}>
                    {getEstadoLabel(order.estado)}
                  </span>
                  <span className="order-total">{formatPrice(order.total)}</span>
                  <button className="expand-button">
                    {expandedOrder === order.id ? '▲' : '▼'}
                  </button>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="order-details">
                  <div className="order-shipping">
                    <h4>Información de Envío</h4>
                    <p><strong>Dirección:</strong> {order.direccionEnvio}</p>
                    {order.telefonoContacto && (
                      <p><strong>Teléfono:</strong> {order.telefonoContacto}</p>
                    )}
                    {order.notas && (
                      <p><strong>Notas:</strong> {order.notas}</p>
                    )}
                  </div>

                  <div className="order-items">
                    <h4>Productos</h4>
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Precio Unit.</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items && order.items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {item.productoImagen && (
                                  <img 
                                    src={item.productoImagen} 
                                    alt={item.productoNombre}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://via.placeholder.com/50x50?text=Sin+Imagen';
                                    }}
                                  />
                                )}
                                <div>
                                  <div>{item.productoNombre}</div>
                                  {item.productoCategoria && (
                                    <small style={{ color: '#666' }}>{item.productoCategoria}</small>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>{item.cantidad}</td>
                            <td>{formatPrice(item.precioUnitario)}</td>
                            <td>{formatPrice(item.subtotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="order-actions">
                    <div className="estado-control">
                      <label>Cambiar Estado:</label>
                      <select
                        value={order.estado}
                        onChange={(e) => handleUpdateEstado(order.id, e.target.value)}
                        disabled={updatingOrderId === order.id || order.estado === 'CANCELADO'}
                        className="estado-select"
                      >
                        {estadosPedido.map((estado) => (
                          <option key={estado} value={estado}>
                            {getEstadoLabel(estado)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {order.estado === 'CANCELADO' && (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        🗑️ Eliminar Pedido
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
