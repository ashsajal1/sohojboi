/**
 * A reusable function to share text, title, and URL using the Web Share API.
 * 
 * @param title - The title of the content to share.
 * @param text - The text description of the content to share.
 * @param url - The URL of the content to share.
 * @returns A promise that resolves if the share is successful and rejects if there's an error.
 */
export function shareContent(title: string, text: string, url: string): Promise<void> {
    if (navigator.share) {
        const data: ShareData = {
            title: title,
            text: text,
            url: url,
        };

        return navigator.share(data)
            .then(() => {
                console.log('Share successful!');
            })
            .catch((error: Error) => {
                console.error('Error sharing:', error);
                throw error;  // Re-throw the error for further handling if needed
            });
    } else {
        console.error('Web Share API is not supported in your browser.');
        return Promise.reject(new Error('Web Share API not supported'));
    }
}