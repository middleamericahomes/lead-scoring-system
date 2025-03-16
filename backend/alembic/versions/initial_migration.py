"""Initial migration

Revision ID: 001
Revises: 
Create Date: 2023-07-01

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create leads table
    op.create_table(
        'leads',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('property_address', sa.String(), nullable=False),
        sa.Column('city', sa.String(), nullable=False),
        sa.Column('state', sa.String(), nullable=False),
        sa.Column('zip_code', sa.String(), nullable=False),
        sa.Column('mailing_address', sa.String(), nullable=True),
        sa.Column('mailing_city', sa.String(), nullable=True),
        sa.Column('mailing_state', sa.String(), nullable=True),
        sa.Column('mailing_zip', sa.String(), nullable=True),
        sa.Column('owner_name', sa.String(), nullable=True),
        sa.Column('score', sa.Float(), nullable=True),
        sa.Column('is_verified_address', sa.Boolean(), nullable=True),
        sa.Column('do_not_append_mailing', sa.Boolean(), nullable=True),
        sa.Column('is_absentee', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_leads_id'), 'leads', ['id'], unique=False)
    op.create_index(op.f('ix_leads_property_address'), 'leads', ['property_address'], unique=False)
    
    # Create tags table
    op.create_table(
        'tags',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('base_score', sa.Float(), nullable=False),
        sa.Column('expiration_days', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tags_id'), 'tags', ['id'], unique=False)
    op.create_index(op.f('ix_tags_name'), 'tags', ['name'], unique=True)
    
    # Create lead_tag association table
    op.create_table(
        'lead_tag',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('lead_id', sa.Integer(), nullable=True),
        sa.Column('tag_id', sa.Integer(), nullable=True),
        sa.Column('assigned_at', sa.DateTime(), nullable=True),
        sa.Column('expiration_at', sa.DateTime(), nullable=True),
        sa.Column('is_expired', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['lead_id'], ['leads.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['tag_id'], ['tags.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('lead_id', 'tag_id', name='uix_lead_tag')
    )
    op.create_index(op.f('ix_lead_tag_id'), 'lead_tag', ['id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_lead_tag_id'), table_name='lead_tag')
    op.drop_table('lead_tag')
    op.drop_index(op.f('ix_tags_name'), table_name='tags')
    op.drop_index(op.f('ix_tags_id'), table_name='tags')
    op.drop_table('tags')
    op.drop_index(op.f('ix_leads_property_address'), table_name='leads')
    op.drop_index(op.f('ix_leads_id'), table_name='leads')
    op.drop_table('leads') 