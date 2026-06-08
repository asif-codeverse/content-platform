export const withTimeout = (
    promise,
    ms,
    operation
) => {
    const timeout = new Promise(
        (_, reject) => {
            setTimeout(() => {
                reject(
                    new Error(
                        `${operation} timed out after ${ms}ms`
                    )
                );
            }, ms);
        }
    );
    return Promise.race([
        promise,
        timeout,
    ]);
};