import React from 'react'

const StarRating = ({rating, starSrc}) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(rating)].map((_, index) => (
        <img
          key={index}
          src={starSrc}
          alt="star"
          className="w-5 h-5"
        />
      ))}
    </div>
  )
}

export default StarRating