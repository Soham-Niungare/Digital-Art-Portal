import PropTypes from 'prop-types';

const Card = ({ children, className }) => {
  return (
    <div className={`border rounded-lg shadow-md bg-white ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }) => {
  return <div className={`p-4 border-b ${className}`}>{children}</div>;
};

const CardContent = ({ children, className }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

const CardFooter = ({ children, className }) => {
  return <div className={`p-4 border-t ${className}`}>{children}</div>;
};

const CardTitle = ({ children, className }) => {
  return <h2 className={`text-lg font-bold ${className}`}>{children}</h2>;
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Card.defaultProps = {
  className: '',
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardHeader.defaultProps = {
  className: '',
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardContent.defaultProps = {
  className: '',
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardFooter.defaultProps = {
  className: '',
};

CardTitle.defaultProps = {
  className: '',
};

export { Card, CardHeader, CardContent, CardFooter , CardTitle};
