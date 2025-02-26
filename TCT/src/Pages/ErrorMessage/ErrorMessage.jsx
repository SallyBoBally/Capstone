function ErrorMessage({ error, resetErrorBoundary }) {
    console.error(error);

    return (
        <div>
            <p>An error occurred:</p>
            <pre>{error.message}</pre>
            <button onClick={() => resetErrorBoundary()}>Try Again</button>
        </div>
    )
}

export default ErrorMessage;