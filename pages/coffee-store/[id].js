import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import useSWR from "swr";

import cls from "classnames";

import { fetchCoffeeStores } from "../../lib/coffee-stores";

import { StoreContext } from "../../store/store-context";

import { isEmpty } from "../../utils/index";

import styles from "../../styles/coffee-store.module.css";

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  const coffeeStores = await fetchCoffeeStores();

  const findCoffeeStoreById = coffeeStores.find(
    (coffeeStore) => coffeeStore.id.toString() === params.id
  );
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((coffeeStore) => ({
    params: {
      id: coffeeStore.id.toString(),
    },
  }));

  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore || {}
  );

  const [votingCount, setVotingCount] = useState(0);

  const id = router.query.id;

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    const { id, name, voting, imgUrl, location, address } = coffeeStore;
    try {
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          location: location || "",
          address: address || "",
        }),
      });

      const dbCoffeeStore = response.json();
    } catch (err) {
      console.error("Error creating coffee store", err);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  useEffect(() => {
    if (!initialProps.coffeeStore || isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find(
          (coffeeStore) => coffeeStore.id.toString() === id
        );

        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      //SSG
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [coffeeStores, id, initialProps.coffeeStore]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const { address, location, name, imgUrl } = coffeeStore;

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = response.json();

      setVotingCount((state) => state + 1);
    } catch (err) {
      console.error("Error upvoting coffee store", err);
    }
  };

  if (error) {
    return <div>Something went wrong retrieving coffee page</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`} />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">← Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={200}
            height={200}
            className={styles.storeImage}
            alt={name}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width="24"
                height="24"
                alt={address}
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {location && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt={location}
              />
              <p className={styles.text}>{location}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
