import { Form, useLoaderData } from '@remix-run/react';
import type { LoaderData } from '~/routes/index/loader.server';
import styles from './styles.module.css';

export { loader } from '~/routes/index/loader.server';

const App = () => {
    const { showForm } = useLoaderData<LoaderData>();

    return (
        <div className={styles.index}>
            <div className={styles.content}>
                <h1 className={styles.heading}>A short heading about [your app]</h1>
                <p className={styles.text}>A tagline about [your app] that describes your value proposition.</p>
                {showForm && (
                    <Form
                        className={styles.form}
                        method='post'
                        action='/auth/login'
                    >
                        <label className={styles.label}>
                            <span>Shop domain</span>
                            <input
                                className={styles.input}
                                type='text'
                                name='shop'
                            />
                            <span>e.g: my-shop-domain.myshopify.com</span>
                        </label>
                        <button
                            className={styles.button}
                            type='submit'
                        >
                            Log in
                        </button>
                    </Form>
                )}
                <ul className={styles.list}>
                    <li>
                        <strong>Product feature</strong>. Some detail about your feature and its benefit to your
                        customer.
                    </li>
                    <li>
                        <strong>Product feature</strong>. Some detail about your feature and its benefit to your
                        customer.
                    </li>
                    <li>
                        <strong>Product feature</strong>. Some detail about your feature and its benefit to your
                        customer.
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default App;
