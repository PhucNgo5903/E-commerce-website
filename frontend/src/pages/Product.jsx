import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProduct from '../components/RelatedProduct';

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const {
    products,
    currency,
    addToCart,
    getReviews,
    addReview,
    token
  } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  /* ---------------- Fetch product & reviews ---------------- */
  useEffect(() => {
    if (!products || products.length === 0 || !productId) return;

    const product = products.find(item => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image?.[0] || '');
    }

    const fetchReviews = async () => {
      const data = await getReviews(productId);
      setReviews(data || []);
    };

    fetchReviews();
  }, [productId, products]);

  /* ---------------- Add review ---------------- */
  const handleAddReview = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (!comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    const success = await addReview(productId, rating, comment);
    if (success) {
      setComment('');
      setRating(5);
      const data = await getReviews(productId);
      setReviews(data || []);
    }
  };

  /* ---------------- Loading guard ---------------- */
  if (!productData) {
    return <div className="opacity-0"></div>;
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity duration-500 opacity-100">

      <div className="flex gap-12 flex-col sm:flex-row">

        {/* ---------------- Product Images ---------------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18.7%] w-full">
            {productData.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt=""
                onClick={() => setImage(img)}
                className="w-[24%] sm:w-full mb-3 flex-shrink-0 cursor-pointer"
              />
            ))}
          </div>

          <div className="w-full sm:w-[80%]">
            <img src={image} alt="" className="w-full h-auto" />
          </div>
        </div>

        {/* ---------------- Product Info ---------------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

          {/* <div className="flex items-center gap-1 mt-2">
            {[...Array(4)].map((_, i) => (
              <img key={i} src={assets.star_icon} className="w-3" />
            ))}
            <img src={assets.star_dull_icon} className="w-3" />
            <p className="pl-2">({reviews.length})</p>
          </div> */}

          <p className="mt-5 text-3xl font-medium">
            {currency}{productData.price}
          </p>

          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    size === item ? 'border-orange-500' : ''
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-black text-white px-8 py-3 active:bg-gray-700"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 w-4/5" />

          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available.</p>
            <p>Easy return and exchange within 7 days.</p>
          </div>
        </div>
      </div>

      {/* ---------------- Description & Reviews ---------------- */}
      <div className="mt-20">
        <div className="flex">
          <b
            onClick={() => setActiveTab('description')}
            className={`border px-5 py-3 cursor-pointer ${
              activeTab === 'description' ? 'bg-gray-100' : ''
            }`}
          >
            Description
          </b>
          <p
            onClick={() => setActiveTab('reviews')}
            className={`border px-5 py-3 cursor-pointer ${
              activeTab === 'reviews' ? 'bg-gray-100' : ''
            }`}
          >
            Reviews ({reviews.length})
          </p>
        </div>

        <div className="border px-6 py-6 text-sm text-gray-500">
          {activeTab === 'description' ? (
            <p>{productData.description}</p>
          ) : (
            <>
              {reviews.length === 0 && <p>No reviews yet.</p>}

              {reviews.map((review, index) => (
                <div key={index} className="border-b pb-4 mb-4">
                  <p className="font-semibold">{review.userId?.name}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        src={i < review.rating ? assets.star_icon : assets.star_dull_icon}
                        className="w-3"
                      />
                    ))}
                  </div>
                  <p>{review.comment}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}

              {token ? (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Add a Review</h3>

                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="border px-2 py-1 mb-2"
                  >
                    {[1,2,3,4,5].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review..."
                    rows={4}
                    className="w-full border px-3 py-2 mb-2"
                  />

                  <button
                    onClick={handleAddReview}
                    className="bg-black text-white px-4 py-2"
                  >
                    Submit Review
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  <p className="text-gray-600">
                    Please <button onClick={() => navigate('/login')} className="text-blue-500 underline">login</button> to write a review.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ---------------- Related Products ---------------- */}
      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;
