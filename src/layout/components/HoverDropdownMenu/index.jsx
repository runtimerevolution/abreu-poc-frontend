import { useState } from "react";
import PropTypes from 'prop-types';
import { Container } from "react-bootstrap";

// Styles
import './style.scss';

const HoverDropdownMenu = ({ label, children }) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  return (
    <div
      className="hover-dropdown-menu"
      onMouseEnter={() => setIsDropDownOpen(true)}
    >
      {label}

      {isDropDownOpen && (
        <Container className="hover-dropdown-menu_content" onMouseLeave={() => setIsDropDownOpen(false)}>
          {children}
        </Container>
      )}
    </div>
  );
}

HoverDropdownMenu.propTypes = {
  label: PropTypes.node.isRequired,
  interactionNode: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
}

export default HoverDropdownMenu;
