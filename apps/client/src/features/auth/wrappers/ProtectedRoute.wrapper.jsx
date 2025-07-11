import { Navigate, useLocation } from "react-router";
import { ROUTES } from "@/shared/constants/routes.constant";
import AccessDeniedPage from "@/shared/pages/AccessDenied.page";
import { ROLES } from "@/shared/constants/roles.constant.js";

/**
 * @param {object} props
 * @param {ReactNode} props.children React children
 * @param {string[]} props.allowedRoles Roles Array
 * @param {string} props.userRole user's role
 * @param {string} props.fallbackRoute fallback route to redirect to if access denied
 * @param {boolean} props.showMessageFlag a flag to set show "access denied" or not
 *
 * @returns {JSX.ELEMENT}
 * @Purpose Ensures route is only accessed to allowed roles
 */
const ProtectedRoute = ({
	children,
	allowedRoles,
	fallbackRoute = ROUTES.DASHBOARD,
	showMessageFlag = true,
}) => {
	const location = useLocation();
	// const user = useSelector(selectCurrentUser);
	const user = { roles: [ROLES.USER] };
	if (!user || !user.roles || !user.roles.length > 0)
		throw new Error("User or user role is undefined.");
	const { roles: userRoles } = user;

	if (allowedRoles.filter(value => userRoles.includes(value))) {
		return showMessageFlag ? (
			<AccessDeniedPage allowedRoles={allowedRoles} userRoles={userRoles} requestedRoute={location.pathname} />
		) : (
			<Navigate
				to={fallbackRoute}
				replace
				state={{
					from: location,
					message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
				}}
			/>
		);
	}

	return children;
};

export default ProtectedRoute;