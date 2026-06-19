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
    <div className="container vh-100">
      <h1 className="text-center mt-4 mb-3 order_title">Orders List</h1>

      {loading && (
        <div className="d-flex flex-column align-items-center justify-content-center mt-5">
          <div className="spinner-border text-dark mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">
            {retryCount === 0
              ? 'Loading orders...'
              : `Server is waking up... (attempt ${retryCount}/${MAX_RETRIES})`}
          </p>
        </div>
      )}

      {!loading && (
        <>
          <div className="dropdown d-flex mb-4 justify-content-end align-items-center">
            <button
              className="btn btn-dark dropdown-toggle me-3"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Sort by {selectedFilter} ({selectedFilter === 'All' ? totalOrders : totalQuantity})
            </button>
            <ul className="dropdown-menu">
              {items.map((itemName, index) => (
                <li key={index}>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() => handleItemClick(itemName)}
                  >
                    {itemName}
                  </button>
                </li>
              ))}
            </ul>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              isClearable
              customInput={
                <button className="btn btn-primary ps-4 pe-4">
                  {selectedDate
                    ? toLocalDateString(selectedDate)
                    : 'Select Date'}
                </button>
              }
            />
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Order Number</th>
                  <th>Customer Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No items found
                    </td>
                  </tr>
                ) : (
                  orderItems.map((order, index) => {
                    const orderNum = (page - 1) * limit + index + 1;
                    const paddedNum = String(orderNum).padStart(3, '0');
                    return (
                      <tr key={order._id}>
                        <td className="col-sm-2">{`OrderNumber #${paddedNum}`}</td>
                        <td className="col-sm-2">{order.customerName}</td>
                        <td className="col-sm-2">{order.date}</td>
                        <td className="col-sm-2">{order.time}</td>
                        <td className="col-sm-2">
                          <ul className="orderListItem">
                            {order.orders.map((item) => (
                              <li key={item._id}>
                                {`${formatItemName(item.name)} - ${item.quantity}`}
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
