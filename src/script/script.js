import { getProducts, getProduct } from "./services.js";

// cart products
let cartProducts = JSON.parse(localStorage.getItem('carts')) || []

const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
});


const renderProducts = async (parent, limit) => {
  if (!parent) {
    return false
  }
  const products = await getProducts()
  products.forEach((product, index) => {
    if (!limit || index <= limit - 1) {
      const template = `
        <a href="./product.html?product_id=${product.id}" class="product-item">
          <div class="product-image">
            <img src="${product.image}" />
            <div class="product-actions">
              <button data-id="${product.id}">
                <i class="fa-solid fa-cart-plus"></i>
              </button>
            </div>
          </div>
          <div class="product-info">
            <p>${product.category}</p>
            <h3>${product.title}</h3>
            <div class="rating">
              <i class="fa-solid fa-star ${product.rating.rate >= 1 ? 'active' : ''}"></i>
              <i class="fa-solid fa-star ${product.rating.rate >= 2 ? 'active' : ''}"></i>
              <i class="fa-solid fa-star ${product.rating.rate >= 3 ? 'active' : ''}" ></i>
              <i class="fa-solid fa-star ${product.rating.rate >= 4 ? 'active' : ''}"></i>
              <i class="fa-solid fa-star ${product.rating.rate >= 5 ? 'active' : ''}"></i>
              <span>
                (${product.rating.count} review)
              </span>
            </div>
            <p class="price">
              $${product.price}
            </p>
          </div>
        </a>
      `

      parent.innerHTML += template
      
    }
  })

  const addCartButtons = document.querySelectorAll('.product-item .product-actions button')

  addCartButtons.forEach((button) => {
    button.addEventListener('click', function(e) {
      e.stopPropagation()
      e.preventDefault()
      const id = this.getAttribute('data-id')
      addCart(id)
    })
  })
  

}


const topProductParent = document.querySelector('#top-products-content')
const allProductParent = document.querySelector('#all-products-content')

renderProducts(topProductParent, 8)
renderProducts(allProductParent)

// open cart
const toggleCart = (show) => {
  const body = document.querySelector('body')
  const cart = document.querySelector('#carts-back')
  const cartContent = document.querySelector('#cart-content')
  
  if (show) {
    body.style.overflow = 'hidden'
    cart.classList.add('active')
    cartContent.classList.add('active')
  } else {
    body.style.overflow = 'visible'
    cart.classList.remove('active')
    cartContent.classList.remove('active')
  }
}

const cartButton = document.querySelector('#cart-button')
const cartBack = document.querySelector('#carts-back')
const cartCloseButton = document.querySelector('#cart-close')

cartButton.addEventListener('click', () => {
  toggleCart(true)
  renderCart(cartProducts)
})

cartBack.addEventListener('click', () => [
  toggleCart(false)
])

cartCloseButton.addEventListener('click', () => {
  toggleCart(false)
})


// render cart item

const renderCart = (data = []) => {
  const cartList = document.querySelector('#cart-list')
  

  const emptyCart = `
      <div class="empty-cart">
        <img src='./src/img/empty-cart.webp' />
        <p>Your Cart is empty</p>
        <a href="/products">Go To Shop</a>
      </div>
  `

  if (!data.length) {
    cartList.innerHTML = emptyCart
  } else {
    cartList.innerHTML = ''
    cartList.classList.add('not-empty')
    data.forEach(item => {
      const cartTemplate = `
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="${item.image}" />
          </div>
          <div class="cart-item-info">
            <div class="cart-info-header">
              <h3>
                ${item.title}
              </h3>
              <button id="cart-close" data-id="${item.id}">
                <i class="fa-solid fa-close"></i>
              </button>
            </div>
            <p>$${item.price}</p>
          </div>
        </div>
      `

      cartList.innerHTML += cartTemplate
    })
  }

  const removeCartButtons = document.querySelectorAll('.cart-item .cart-info-header button')

  removeCartButtons.forEach((button) => {
    button.addEventListener('click', function() {
      const id = this.getAttribute('data-id')
      removeCart(id)
    })
  })

  renderTotalPrice(data)

}

const addCart = async (id) => {
  const existed = cartProducts.find(product => product.id === parseInt(id))
  if (existed) {
    return false
  }

  const product = await getProduct(id)
  cartProducts.push(product)

  localStorage.setItem('carts', JSON.stringify(cartProducts))

  getCartCount(cartProducts)
}

const removeCart = (id) => {
  const newProduct = cartProducts.filter(product => product.id !== parseInt(id))
  cartProducts = newProduct
  localStorage.setItem('carts', JSON.stringify(cartProducts))
  renderCart(cartProducts)
  getCartCount(cartProducts)
}

const renderTotalPrice = (data) => {
  const cartTotalPrice = document.querySelector('#cart-total-price')
  const price = getTotalPrice(data)

  cartTotalPrice.innerHTML = `$${price}`

}

const renderOrderTotalPrice = (data) => {
  const productPrices = getTotalPrice(data)
  const shipping = document.querySelector('#shipping-price').innerHTML.replace('$', '')
  const discount = document.querySelector('#discount').innerHTML.replace('$', '')
  const shippingPrice = Number(shipping)
  const discountPrice = Number(discount)

  const subtotal = document.querySelector('#subtotal')
  subtotal.innerHTML = `$${productPrices}`
  const total = document.querySelector('#order-total')
  const totalPrice = productPrices + shippingPrice - discountPrice;


  total.innerHTML = `$${totalPrice < 0 ? 0 : totalPrice}`
}
const getTotalPrice = (data) => {
  let sum = 0

  data.forEach(item => {
    sum += item.price
  })

  return sum

}

const getCartCount = (data) => {
  const cartCount = document.querySelector('#cart-count')

  cartCount.innerHTML = data.length || 0
}

renderCart(cartProducts)
getCartCount(cartProducts)



// render order item
const renderOrderItem = (data) => {
  if (data.length) {
    const parent = document.querySelector('#order-items')
    if(!parent) {
      return false
    }
    data.forEach((item) => {
      const template = `
        <p>
          <span>${item.title}</span>
          <span>$${item.price}</span>
        </p>
      `

      parent.innerHTML += template
    })

    renderOrderTotalPrice(data)
  }
}

renderOrderItem(cartProducts)



// render product details

const renderProductDetails = async () => {
  const productId = window.location?.search?.replace('?', '')?.split('=')?.[1]
  if (productId) {
    const product = await getProduct(productId)
    const productDetails = document.querySelector('#product-details')
    if (product && productDetails) {
      const template = `
        <div class="product-image">
            <img src="${product.image}" />
        </div>
        <div class="product-info">
            <p>${product.category}</p>
            <h3>${product.title}</h3>
            <div class="rating">
                <i class="fa-solid fa-star ${product.rating.rate >= 1 ? 'active' : ''}"></i>
                <i class="fa-solid fa-star ${product.rating.rate >= 2 ? 'active' : ''}"></i>
                <i class="fa-solid fa-star ${product.rating.rate >= 3 ? 'active' : ''}" ></i>
                <i class="fa-solid fa-star ${product.rating.rate >= 4 ? 'active' : ''}"></i>
                <i class="fa-solid fa-star ${product.rating.rate >= 5 ? 'active' : ''}"></i>
                <span>
                  (${product.rating.count} review)
                </span>
            </div>
            <p>${product.description}</p>
            <p class="price">$${product.price}</p>
            <button id='product-details-add-cart'>
                Add Cart
            </button>
        </div>
      `

      productDetails.innerHTML = template
    }

    const addCartButton = document.querySelector('#product-details-add-cart')
    addCartButton.addEventListener('click', function() {
      addCart(productId)
    })


  }


}

renderProductDetails()