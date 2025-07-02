import { Outlet, NavLink } from "react-router"

export const PageLayout = () => {
    return (<>
    <nav className="h-[80px] w-full flex justify-center gap-[16px] text-[40px] items-center text-white bg-black">
        <NavLink to="/" className={({isActive}) => isActive ? "text-yellow-500 underline" : "hover:text-gray-300"}>Customers</NavLink>
        <NavLink to="/lots" className={({isActive}) => isActive ? "text-yellow-500 underline" : "hover:text-gray-300"}>Lots</NavLink>
    </nav>
    <Outlet/>
    </>)
}