import {pool} from '@/app/lib/db/pool'

//switch to js (no zod, no type check)

// fetch filtered


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

const ITEMS_PER_PAGE = 6;

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

export async function fetchViewsPages(id) {
  try {
    const [results, field] = await pool.query(`
      SELECT COUNT(*)
      FROM
        client_views v
      INNER JOIN
        project_views pv ON v.id = pv.view_id
      WHERE
        pv.project_id = "${id}"
    `);

    const totalPages = Math.ceil(Number(results[0]['COUNT(*)']) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of suppliers.');
  }
}

// fetch by id

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
    throw new Error('Failed to fetch suppliers.');
  }
}

export async function fetchProjectById(id) {
  try {
    const [result, field] = await pool.query(`
      SELECT *
      FROM projects
      WHERE id = '${id}';
    `);
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch ProjectsById.');
  }
}

export async function fetchUrnByClientViewId(id) {

  try {
    const [result, fields] = await pool.query(`
      SELECT 
        urn,
        title,
        subtitle
      FROM client_views
      WHERE id = '${id}';
    `)
    return result[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to client view.');
  }

}

// else

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

export async function fetchUserByName(query) {
  try {

    const [result, field] = await pool.query(`
      SELECT name, id
      FROM users
      WHERE 
        name LIKE '%${query}%'
    `)
    console.log(result);
    return result;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user');
  }
}

export async function fetchViewsByRoomId(id) {
  try {

    const [supersets, field] = await pool.query(`
      SELECT id, ss_title, data
      FROM superset_view
      WHERE
        client_view_id = "${id}"
    `)
    return supersets

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Supersets');
  }
}

// joint searches

export async function fetchUsersByProjectId(id) {
  try {
    const [result, fields] = await pool.query(`
      SELECT
        u.id,
        u.name
      FROM
        users u
      INNER JOIN
        project_user pu ON u.id = pu.user_id
      WHERE
        pu.project_id = "${id}" 
    `)
    return result;
  } catch (error) {
    console.error('Database Error', error);
    return null;
  }
}

export async function fetchSuppliersByProjectId(id) {
  try {
    const [result, fields] = await pool.query(`
      SELECT
        s.id,
        s.name
      FROM
        suppliers s
      INNER JOIN
        project_supplier ps ON s.id = ps.supplier_id
      WHERE
        ps.project_id = "${id}"
    `)
    return result;
  } catch (error) {
    console.error('Database Error', error);
    return null;
  }
}

export async function fetchClientViewsByProjectId(id) {
  try {
    const [views, fields] = await pool.query(`
      SELECT
        v.id,
        v.urn,
        v.title,
        v.subtitle,
        v.filename
      FROM
        client_views v
      INNER JOIN
        project_views pv ON v.id = pv.view_id
      WHERE
        pv.project_id = "${id}"
    `)
    return views;
  } catch (error) {
    console.error('Database Error', error);
    return null;
  }
}

export async function fetchSupersetById(id) {
  try {
    const [superset, field] = await pool.query(`
      SELECT client_views.urn, client_views.title, client_views.subtitle
      FROM superset_view
      INNER JOIN client_views ON superset_view.client_view_id = client_views.id
      WHERE superset_view.id = "${id}";
    `)
    return superset[0];
  } catch (error) {
    console.error('Database Error', error);
    throw new Error('Failed to fetch Supersets')
  }
}