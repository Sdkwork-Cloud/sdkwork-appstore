-- Default appstore publisher for composed Claw Router bootstrap (tenant 10 / org 20).
INSERT INTO appstore_publisher
    (
        id,
        tenant_id,
        organization_id,
        publisher_no,
        publisher_type,
        display_name,
        publisher_status,
        verification_status,
        owner_user_id,
        created_at,
        updated_at
    )
VALUES
    (
        'appstore-publisher-default-20',
        '10',
        '20',
        'default-root',
        'organization',
        'Root Organization Publisher',
        'active',
        'verified',
        '1',
        CURRENT_TIMESTAMP::text,
        CURRENT_TIMESTAMP::text
    )
ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    publisher_status = EXCLUDED.publisher_status,
    verification_status = EXCLUDED.verification_status,
    updated_at = EXCLUDED.updated_at;
