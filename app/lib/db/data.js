import {pool} from '@/app/lib/db/pool'
import {SupplierForm} from '@/app/lib/db/definitions'

//switch to js (no zod, no type check)

// fetch filtered

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredSuppliers(
  query,
  currentPage
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const [suppliers, fields] = await pool.query(`
      SELECT
        id,
        name,
        email,
        phone,
        address
      FROM suppliers
      WHERE
        name LIKE ${`'%${query}%'`} OR
        email LIKE ${`'%${query}%'`} OR
        phone LIKE ${`'%${query}%'`} OR
        address LIKE ${`'%${query}%'`}
      ORDER BY name DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `);

    return suppliers;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch suppliers.');
  }
}

export async function fetchFilteredMachinery(
  query,
  currentPage
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const [machines, fields] = await pool.query(`
      SELECT
        id,
        model,
        producer_website,
        type
      FROM machinery
      WHERE
        model LIKE ${`'%${query}%'`} OR
        producer_website LIKE ${`'%${query}%'`} OR
        type LIKE ${`'%${query}%'`}
      ORDER BY model DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `);

    return machines;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch machines.');
  }
}

export async function fetchFilteredProjects(
  query,
  currentPage
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const [projects, fields] = await pool.query(`
      SELECT
        id,
        name
      FROM projects
      WHERE
        name LIKE ${`'%${query}%'`}
      ORDER BY name DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `);

    return projects;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch projects.');
  }
}

// fetch pages

export async function fetchSuppliersPages(query) {
  try {
    const [results, field] = await pool.query(`SELECT COUNT(*)
    FROM suppliers
    WHERE
      name LIKE ${`'%${query}%'`} OR
      email LIKE ${`'%${query}%'`} OR
      phone LIKE ${`'%${query}%'`} OR
      address LIKE ${`'%${query}%'`}
  `);

    const totalPages = Math.ceil(Number(results[0]['COUNT(*)']) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of suppliers.');
  }
}

export async function fetchMachinesPages(query) {
  try {
    const [results, field] = await pool.query(`SELECT COUNT(*)
    FROM machinery
    WHERE
      model LIKE ${`'%${query}%'`} OR
      producer_website LIKE ${`'%${query}%'`} OR
      type LIKE ${`'%${query}%'`}
  `);

    const totalPages = Math.ceil(Number(results[0]['COUNT(*)']) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of suppliers.');
  }
}

export async function fetchProjectsPages(query) {
  try {
    const [results, field] = await pool.query(`SELECT COUNT(*)
    FROM projects
    WHERE
      name LIKE ${`'%${query}%'`}
  `);

    const totalPages = Math.ceil(Number(results[0]['COUNT(*)']) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of suppliers.');
  }
}

// else

export async function fetchSuppliersById(id) {
  try {
    const [result, field] = await pool.query(`
      SELECT
        id,
        name,
        email,
        phone,
        address,
        url,
        notes,
        contact,
        contact_number,
        vat,
        tax_code
      FROM suppliers
      WHERE id = '${id}';
    `);
    console.log(result)
    return result[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchMachineryTypes() {
  try {
    const [result, fields] = await pool.query(`
      SELECT
        type
      FROM machinery_types
      ORDER BY type ASC
    `);
    return result;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchSupplierByName(query) {
  try {

    const [result, field] = await pool.query(`
      SELECT name, id
      FROM suppliers
      WHERE name LIKE '%${query}%'
    `)

    return result;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}