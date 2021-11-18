function menuClickEvent() {
  const menuList = document.querySelectorAll('.menu-list > li > a');

  for (let i = 0; i < menuList.length; i++) {
    if (location.href === menuList[i].href) {
      menuList[i].parentElement.className += ` active`;
    }
  }
}

function createMenu() {
  const headerNavbarMenu = document.getElementById('header-navbar-menu');
  const ul = document.createElement('ul');
  ul.className = 'navbar-nav ml-auto menu-list';

  ul.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="/">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/forum/list">Forum</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/news">News</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/pricing">Pricing</a>
            </li>
                ${
                  localStorage.getItem('token')
                    ? `<li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            User
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <a class="dropdown-item" href="/user/profile">Profile</a>
                            <a class="dropdown-item sign-out" href="/">Logout</a>
                        </div>
                    </li>`
                    : `<li class="nav-item">
                        <a class="nav-link" href="/user/sign-in">Sign In</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/user/sign-up">Sign Up</a>
                    </li>`
                }`;

  headerNavbarMenu.append(ul);

  signOut();
  menuClickEvent();
}

function signOut() {
  const signOut = document.querySelector('.sign-out');

  if (signOut) {
    signOut.addEventListener('click', () => localStorage.removeItem('token'));
  }
}

createMenu();
