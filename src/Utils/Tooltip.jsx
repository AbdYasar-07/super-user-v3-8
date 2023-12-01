import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const ToolTip = ({ label, info }) => {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {info}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="left-end"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <Button variant="outline-primary">{label}</Button>
    </OverlayTrigger>
  );
};

export default ToolTip;
