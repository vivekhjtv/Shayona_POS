import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Pagination from 'react-bootstrap/Pagination';
import { formatItemName } from '../utils/format';

function OrderList() {
  const [orderItems, setOrderItems] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimer = useRef(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Records per page
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const items = [
    'All',
    'Samosa',
    'Puff',
    'Dabeli',
    'Khichadi',
    'Papadi no lot',
    'Pav Bhaji',
  ];

  const MAX_RETRIES = 10;
  const RETRY_DELAY_MS = 2000;

  // Format date using LOCAL time parts to avoid UTC timezone shift (e.g. IST-5:30 → wrong day)
  const toLocalDateString = (date) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getItemsFromDataBase = async (pageNum, filterItem, filterDate, attempt = 0) => {
    const BASE_URL = process.env.REACT_APP_GLOBAL_URL;
    const formattedDate = toLocalDateString(filterDate);

    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/orders`, {
        params: {
          page: pageNum,
          limit,
          item: filterItem,
          date: formattedDate
        }
      });

      let fetchedOrders = [];
      let fetchedTotalPages = 1;
      let fetchedTotalOrders = 0;
      let fetchedTotalQuantity = 0;

      if (Array.isArray(response.data)) {
        // Fallback if backend returned plain array (e.g. before backend restart)
        // Perform local pagination
        const allOrders = response.data;

        // Filter by date if selected
        let filteredByDate = allOrders;
        if (formattedDate) {
          filteredByDate = allOrders.filter(o => o.date === formattedDate);
        }

        // Filter by item if selected
        const itemLower = (filterItem || 'All').toLowerCase();
        const matchNames = [filterItem || 'All', itemLower];
        if (itemLower === 'khichadi') matchNames.push('khichadi', 'Khichadi');
        if (itemLower === 'pav bhaji') matchNames.push('pav_bhaji', 'Pav Bhaji');
        if (itemLower === 'papadi no lot') matchNames.push('lot', 'papadi_no_lot', 'papadi lot', 'Papadi lot', 'Papadi no lot', 'Papadi Lot');
        if (itemLower === 'samosa') matchNames.push('samosa', 'samosa_chat', 'chat', 'Samosa');
        if (itemLower === 'puff') matchNames.push('puff', 'Puff');
        if (itemLower === 'dabeli') matchNames.push('dabeli', 'Dabeli');

        let finalFiltered = filteredByDate;
        if (filterItem && filterItem !== 'All') {
          finalFiltered = filteredByDate.filter(order =>
            order.orders.some(it => matchNames.includes(it.name))
          );
        }

        // Calculate total quantity of matched items
        if (filterItem && filterItem !== 'All') {
          finalFiltered.forEach(order => {
            order.orders.forEach(it => {
              if (matchNames.includes(it.name)) {
                fetchedTotalQuantity += it.quantity;
              }
            });
          });
        }

        fetchedTotalOrders = finalFiltered.length;
        fetchedTotalPages = Math.ceil(finalFiltered.length / limit) || 1;
        fetchedOrders = finalFiltered.slice((pageNum - 1) * limit, pageNum * limit);
      } else if (response.data && response.data.orders) {
        // Standard paginated object from updated backend
        fetchedOrders = response.data.orders;
        fetchedTotalPages = response.data.totalPages || 1;
        fetchedTotalOrders = response.data.totalOrders || 0;
        fetchedTotalQuantity = response.data.totalQuantity || 0;
      }

      setOrderItems(fetchedOrders);
      setTotalPages(fetchedTotalPages);
      setTotalOrders(fetchedTotalOrders);
      setTotalQuantity(fetchedTotalQuantity);
      setLoading(false);
      setRetryCount(0);
    } catch (error) {
      console.error(`Fetch attempt ${attempt + 1} failed:`, error.message);
      if (attempt < MAX_RETRIES) {
        setRetryCount(attempt + 1);
        retryTimer.current = setTimeout(() => {
          getItemsFromDataBase(pageNum, filterItem, filterDate, attempt + 1);
        }, RETRY_DELAY_MS);
      } else {
        setLoading(false); // give up after MAX_RETRIES
      }
    }
  };

  useEffect(() => {
    clearTimeout(retryTimer.current);
    getItemsFromDataBase(page, selectedFilter, selectedDate, 0);
    return () => clearTimeout(retryTimer.current); // cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedFilter, selectedDate]);

  const handleItemClick = (itemName) => {
    setSelectedFilter(itemName);
    setPage(1); // Reset to page 1 on filter change
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setPage(1); // Reset to page 1 on date change
  };

  const renderPaginationItems = () => {
    const items = [];

    // Always show First Page
    items.push(
      <Pagination.Item key={1} active={page === 1} onClick={() => setPage(1)}>
        1
      </Pagination.Item>
    );

    let startPage = Math.max(2, page - 2);
    let endPage = Math.min(totalPages - 1, page + 2);

    // If we have very few pages, show all of them without ellipsis
    if (totalPages <= 7) {
      for (let p = 2; p < totalPages; p++) {
        items.push(
          <Pagination.Item key={p} active={page === p} onClick={() => setPage(p)}>
            {p}
          </Pagination.Item>
        );
      }
    } else {
      // Show ellipsis if startPage > 2
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
      }

      // Show window around current page
      for (let p = startPage; p <= endPage; p++) {
        items.push(
          <Pagination.Item key={p} active={page === p} onClick={() => setPage(p)}>
            {p}
          </Pagination.Item>
        );
      }

      // Show ellipsis if endPage < totalPages - 1
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
      }
    }

    // Always show Last Page
    if (totalPages > 1) {
      items.push(
        <Pagination.Item key={totalPages} active={page === totalPages} onClick={() => setPage(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <h1 className="order_title mb-2 mb-md-0">Order History</h1>
        
        {!loading && (
          <div className="d-flex align-items-center gap-2">
            <div className="dropdown">
              <button
                className="btn btn-outline-dark dropdown-toggle px-3 py-2"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ borderRadius: '8px', fontWeight: '500' }}
              >
                Filter: {selectedFilter} ({selectedFilter === 'All' ? totalOrders : totalQuantity})
              </button>
              <ul className="dropdown-menu shadow-sm">
                {items.map((itemName, index) => (
                  <li key={index}>
                    <button
                      className="dropdown-item py-2"
                      type="button"
                      onClick={() => handleItemClick(itemName)}
                    >
                      {itemName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              isClearable
              customInput={
                <button 
                  className="btn btn-outline-dark px-3 py-2 d-flex align-items-center gap-2"
                  style={{ borderRadius: '8px', fontWeight: '500' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar3" viewBox="0 0 16 16">
                    <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/>
                    <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                  </svg>
                  {selectedDate ? toLocalDateString(selectedDate) : 'Select Date'}
                </button>
              }
            />
          </div>
        )}
      </div>

      {loading && (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">
            {retryCount === 0
              ? 'Loading orders...'
              : `Connecting to database... (attempt ${retryCount}/${MAX_RETRIES})`}
          </p>
        </div>
      )}

      {!loading && (
        <>
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th style={{ width: '18%' }}>Order ID</th>
                  <th style={{ width: '22%' }}>Customer Name</th>
                  <th style={{ width: '15%' }}>Date</th>
                  <th style={{ width: '15%' }}>Time</th>
                  <th style={{ width: '30%' }}>Items Ordered</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No matching order logs found.
                    </td>
                  </tr>
                ) : (
                  orderItems.map((order, index) => {
                    const orderNum = (page - 1) * limit + index + 1;
                    const paddedNum = String(orderNum).padStart(3, '0');
                    return (
                      <tr key={order._id}>
                        <td>
                          <span className="badge bg-dark rounded-pill px-3 py-2">
                            #{paddedNum}
                          </span>
                        </td>
                        <td><strong>{order.customerName}</strong></td>
                        <td>{order.date}</td>
                        <td>{order.time}</td>
                        <td>
                          <ul className="orderListItem">
                            {order.orders.map((item) => (
                              <li key={item._id || item.name} className="py-1">
                                <span className="text-primary">•</span> {formatItemName(item.name)}{' '}
                                <span className="text-muted">({item.quantity})</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4 pb-5">
              <Pagination>
                <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
                <Pagination.Prev onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} />

                {renderPaginationItems()}

                <Pagination.Next onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages} />
                <Pagination.Last onClick={() => setPage(totalPages)} disabled={page === totalPages} />
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default OrderList;
