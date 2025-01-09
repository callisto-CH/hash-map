class HashSet {
  constructor(capacity, loadFactor) {
    this._initialCapacity = capacity;
    this._capacity = capacity;
    this._loadFactor = loadFactor;
    this._buckets = [];
    this._length = 0;
  }

  get length() {
    return this._length;
  }

  #hash(key) {
    let hashCode = 0;
    const primeNumber = 37;
    for (let i = 0; i < key.length; i++) {
      hashCode =
        (primeNumber * hashCode + key.charCodeAt(i) + 3) % this._capacity;
    }
    return hashCode;
  }

  #rehash(type) {
    if (type == "expand") this._capacity *= 2;
    if (type == "contract") this._capacity /= 2;
    let newBuckets = [];
    for (const bucket of this._buckets) {
      for (const key in bucket) {
        let index = this.#hash(key);
        if (!newBuckets[index]) newBuckets[index] = {};
        newBuckets[index][key] = true;
      }
    }
    this._buckets = newBuckets;
  }

  set(key) {
    let index = this.#hash(key);
    if (!this._buckets[index]) this._buckets[index] = {};
    let bucket = this._buckets[index];

    if (!bucket[key]) this._length += 1;
    bucket[key] = true;

    const rehashThreshold = this._capacity * this._loadFactor;
    if (this._length > rehashThreshold) this.#rehash("expand");
  }

  has(key) {
    let index = this.#hash(key);
    let bucket = this._buckets[index];

    return bucket && bucket[key] ? true : false;
  }

  remove(key) {
    let index = this.#hash(key);
    let bucket = this._buckets[index];

    if (!(bucket && bucket[key])) return false;

    delete bucket[key];
    if (Object.keys(bucket).length == 0) this._buckets[index] = null;
    this._length -= 1;

    const rehashThreshold = (this._capacity / 2) * this._loadFactor;
    if (
      this._length <= rehashThreshold &&
      this._capacity > this._initialCapacity
    )
      this.#rehash("contract");
    return true;
  }

  clear() {
    this._buckets = [];
    this._capacity = this._initialCapacity;
    this._length = 0;
  }

  keys() {
    let arr = [];
    for (const bucket of this._buckets) {
      if (bucket) arr = arr.concat(Object.keys(bucket));
    }
    return arr;
  }
}
