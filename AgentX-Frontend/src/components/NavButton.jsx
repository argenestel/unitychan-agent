import React from 'react'


const NavButton = ({text,logo,activelogo,active=false,onClick}) => {
    return (
        <div onClick={onClick} className={`cursor-pointer text-sm flex items-center border-[#B6F09C] ${active && 'border-b-[3px]'} pb-5 plus-jakarta-sans-400 text-gray-400 mt-2 mr-7`}>
            <img className='mr-3' src={active?activelogo:logo} alt="" />
            <p className={active ? 'text-white' : 'text-[#9B9C9E]'}>{text}</p>
        </div>
    )
}

export default NavButton