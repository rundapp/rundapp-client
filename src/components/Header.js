import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import logo from "../assets/runner-app-logo.png";

const Header = () => {
	return (
		<Menu style={{ marginTop: 10, height: 15 }}>
			<Link to="/" className="item">
				Home
			</Link>

			<Link to="/challenge" className="item">
				Create a Challenge
			</Link>

			<Link to="/claim" className="item">
				Claim a Prize
			</Link>

			<Menu.Menu position="right">
				<img alt="logo" src={logo} style={{ paddingRight: 20 }} />
			</Menu.Menu>
		</Menu>
	);
};

export default Header;
