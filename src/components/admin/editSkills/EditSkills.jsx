import React, { useState } from 'react';
import { Card, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import styled from 'styled-components/macro';
import { Trash2, Edit } from 'react-feather';

import useFetch from '../../../hooks/useFetch';
import StyledMain from '../../../shared/StyledMain';
import SkillModal from './SkillModal';
import DeleteModal from './DeleteSkillModal';
import Loading from '../../../shared/Loading';
import Error from '../../../shared/Error';

const StyledSkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
  grid-gap: 40px;
`;

const StyledButton = styled.button`
  border: none;
  cursor: pointer;
  align-self: center;
  &:focus {
    outline: none;
  }
  background-color: transparent;
`;

const EditSkills = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addSkillModalOpen, setAddSkillModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clickedModalData, setClickedModalData] = useState(null);
  const [{ data, isLoading, isError }, setData] = useFetch(
    'skillsMatrix',
    '/skillslist',
    { Items: [] },
  );

  return (
    <StyledMain>
      <h2>Edit Skills</h2>
      <p>Use this page to add, edit and delete skills.</p>
      <Button
        disabled={isLoading}
        css="margin-bottom: 40px"
        onClick={() => {
          setClickedModalData({
            skillName: '',
            skillDescription: '',
            skillId: '',
          });
          setAddSkillModalOpen(true);
        }}
      >
        Add new skill
      </Button>
      {isError ? (
        <Error error={isError} contentWidth header />
      ) : (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <StyledSkillsGrid>
                {data.Items.length < 1 ? (
                  <div css="grid-column: span 2">
                    <p>
                      <strong>No skills to display.</strong>
                    </p>
                    <p>Skills can be added using the button above.</p>
                  </div>
                ) : (
                  data.Items.map((skill, index) => {
                    const { skillName, skillDescription, skillId } = skill;
                    return (
                      <Card key={skillId}>
                        <Card.Body>
                          <Card.Title>
                            <div css="float: right">
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Edit</Tooltip>}
                              >
                                <StyledButton
                                  name={skillName}
                                  type="button"
                                  onClick={() => {
                                    setClickedModalData(data.Items[index]);
                                    setEditModalOpen(true);
                                  }}
                                >
                                  <Edit size={18} />
                                </StyledButton>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Delete</Tooltip>}
                              >
                                <StyledButton
                                  type="button"
                                  onClick={() => {
                                    setClickedModalData(data.Items[index]);
                                    setDeleteModalOpen(true);
                                  }}
                                >
                                  <Trash2 size={18} />
                                </StyledButton>
                              </OverlayTrigger>
                            </div>
                            {skillName}
                          </Card.Title>
                          <Card.Text>{skillDescription}</Card.Text>
                        </Card.Body>
                      </Card>
                    );
                  })
                )}
              </StyledSkillsGrid>

              <SkillModal
                addSkill
                modalOpen={addSkillModalOpen}
                setOpenModal={setAddSkillModalOpen}
                clickedModalData={clickedModalData}
                setClickedModalData={setClickedModalData}
                setData={setData}
              />

              <SkillModal
                modalOpen={editModalOpen}
                setOpenModal={setEditModalOpen}
                clickedModalData={clickedModalData}
                setClickedModalData={setClickedModalData}
                setData={setData}
              />

              <DeleteModal
                modalOpen={deleteModalOpen}
                setOpenModal={setDeleteModalOpen}
                clickedModalData={clickedModalData}
                setClickedModalData={setClickedModalData}
                setData={setData}
              />
            </>
          )}
        </>
      )}
    </StyledMain>
  );
};

export default EditSkills;