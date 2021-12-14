import React from 'react';

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='pagination' className="pagination justify-content-end">
        <li className="page-item disabled">
          <a className="page-link" href="#" tabindex="-1">Previous</a>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className='page-item'>
            <a onClick={() => paginate(number)} className='page-link' >
              {number}
            </a>
          </li>
          
        ))}
        
        <li className="page-item">
          <a className="page-link"onClick={() => paginate(1)}>Next</a>
        </li>
        
      </ul>
    </nav>
  );
};

export default Pagination;