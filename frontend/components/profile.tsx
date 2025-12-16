import React from 'react'

const ProfileIcon = ({size}: {size?: number}) => {
  if (size === undefined) size = 10;

  return <div className={`w-${size} h-${size} rounded-full bg-linear-to-br from-[#C4F042] to-[#B4D9FF] shrink-0`} />
}

export default ProfileIcon