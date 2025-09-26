export default function Buttom({id, children, className = ""}) {
    return (
        <>
            <button
                id={id}
                className={`btn btn-primary rounded-pill py-2 fw-bold ${className}`}
                style={{ backgroundColor: "#3559a1", border: "none" }}
                type="submit"
            >
                {children}
            </button>
        </>
    );
}