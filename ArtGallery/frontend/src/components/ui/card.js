import PropTypes from 'prop-types';

const Card = ({ title, children, footer, className }) => {
  return (
    <div className={`border rounded-lg shadow-md p-4 bg-white ${className}`}>
      {title && <h2 className="text-lg font-bold mb-2">{title}</h2>}
      <div className="content">{children}</div>
      {footer && <div className="mt-4 text-gray-600">{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  className: PropTypes.string,
};

Card.defaultProps = {
  title: '',
  footer: null,
  className: '',
};

export default Card;
