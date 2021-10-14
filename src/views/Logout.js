import Cookies from 'js-cookie'

function Logout() {
    Cookies.remove("user");
}

export default Logout;